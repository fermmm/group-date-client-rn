import { deleteAllCache } from "../tools/useCache/useCache";
import {
   loadFromDevice,
   removeFromDevice,
   saveOnDevice
} from "../../common-tools/device-native-api/storage/storage";
import { useContext, useEffect, useState } from "react";
import { LocalStorageKey } from "../../common-tools/strings/LocalStorageKey";
import { checkFacebookToken } from "./providers/facebook/checkFacebookToken";
import { checkGoogleToken } from "./providers/google/checkGoogleToken";
import { useGetGoogleToken } from "./providers/google/getGoogleToken";
import { AuthenticationProvider } from "../server/shared-tools/authentication/AuthenticationProvider";
import {
   createExtendedInfoToken,
   getTokenInfo
} from "../server/shared-tools/authentication/tokenStringTools";
import { useEmailToken } from "./providers/email/getEmailToken";
import { checkEmailToken } from "./providers/email/checkEmailToken";
import { useNavigation } from "../../common-tools/navigation/useNavigation";
import { getFacebookToken } from "./providers/facebook/getFacebookToken";
import { GlobalContext } from "../../common-tools/contexts/GlobalContext";
import { EMAIL_LOGIN_ENABLED, FACEBOOK_LOGIN_ENABLED, GOOGLE_LOGIN_ENABLED } from "../../config";

let fasterTokenCache: string = null;

/**
 * This hook tries to get the token, first from the parameter, if not present tries from local storage, if it's
 * still null you should call getNewToken() function returned by this hook this shows an authorize screen from
 * the authentication provider selected (if required). After calling getNewToken() the token can be still null
 * (user cancelled, API or connection problem)
 *
 * Optionally you can set a token to be checked, this is recommended at login. Tokens can be invalid when
 * the user revoked the permission to run the application or when the token is expired.
 */
export function useAuthentication(
   externallyProvidedToken?: string,
   options?: UseAuthenticationOptions
): UseAuthentication {
   const { checkTokenIsValid = false, enabled = true } = options ?? {};
   const { logout } = useLogout();
   const token = useToken(externallyProvidedToken);
   const { isValid: tokenIsValid, isLoading: tokenCheckLoading } = useTokenCheck({
      token: token.token,
      onTokenInvalidFormat: logout,
      onTokenFromDisabledLoginProvider: logout,
      enabled: checkTokenIsValid && token.token != null && enabled
   });

   // This is commented because when the token expires it throws some errors instead of re login.
   // This was made for google login but it's now disabled.
   // useAutomaticReLogin({
   //    token,
   //    enabled: tokenIsValid === false && checkTokenIsValid && enabled
   // });

   const isLoading =
      token.isLoading || (options?.checkTokenIsValid === true ? tokenCheckLoading : false);

   const result = {
      token: token.token,
      isLoading,
      tokenIsValid,
      getNewToken: token.getNewToken,
      logout
   };

   return result;
}

/**
 * This hook tries to get the token, first from the parameter, if not present tries from local storage, if it's
 * still null you should call getNewToken() function returned by this hook this shows an authorize screen from
 * the authentication provider selected (if required). After calling getNewToken() the token can be still null
 * (user cancelled, API or connection problem)
 */
function useToken(externallyProvidedToken?: string): UseToken {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [token, setToken] = useState<string>(null);
   const [fetchingNewToken, setFetchingNewToken] = useState<boolean>(false);
   const [attemptedFromDevice, setAttemptedFromDevice] = useState<boolean>(false);
   const getGoogleToken = useGetGoogleToken();
   const getEmailToken = useEmailToken();

   const getNewToken = (provider: AuthenticationProvider) => {
      fasterTokenCache = null;
      setToken(null);
      setIsLoading(true);
      setFetchingNewToken(true);

      let tokenGetter: () => Promise<string | null>;
      switch (provider) {
         case AuthenticationProvider.Facebook:
            tokenGetter = getFacebookToken;
            break;
         case AuthenticationProvider.Google:
            tokenGetter = getGoogleToken;
            break;
         case AuthenticationProvider.Email:
            tokenGetter = getEmailToken;
            break;
      }

      tokenGetter()
         .then(newToken => {
            if (Boolean(newToken) === false) {
               fasterTokenCache = null;
               setToken(null);
               setIsLoading(false);
               setFetchingNewToken(false);
               return;
            }

            newToken = createExtendedInfoToken({ originalToken: newToken, provider });
            saveOnDevice(LocalStorageKey.AuthenticationToken, newToken, { secure: true }).then(
               () => {
                  fasterTokenCache = newToken;
                  setToken(newToken);
                  setIsLoading(false);
                  setFetchingNewToken(false);
               }
            );
         })
         .catch(error => {
            fasterTokenCache = null;
            setToken(null);
            setIsLoading(false);
            setFetchingNewToken(false);
         });
   };

   if (externallyProvidedToken != null || token != null || fasterTokenCache != null) {
      return {
         token: externallyProvidedToken ?? token ?? fasterTokenCache,
         isLoading: false,
         getNewToken
      };
   }

   if (!fetchingNewToken && !attemptedFromDevice) {
      setAttemptedFromDevice(true);
      // Try to get stored token from previous session
      loadFromDevice(LocalStorageKey.AuthenticationToken, { secure: true })
         .then(tokenFromDevice => {
            setIsLoading(false);
            if (tokenFromDevice == null) {
               return;
            }
            fasterTokenCache = tokenFromDevice;
            setToken(tokenFromDevice);
         })
         .catch(error => {
            setIsLoading(false);
         });
   }

   return { token, isLoading, getNewToken };
}

/**
 * Uses the token to get some user information from Provider API and if the information is returned it
 * means the token is valid. It's better to check this on the client than on the server, dealing with
 * an extra server error is more complex. If the token is not valid then getNewToken() should be called.
 */
function useTokenCheck(props: {
   token: string;
   onTokenInvalidFormat: () => void;
   onTokenFromDisabledLoginProvider: () => void;
   enabled: boolean;
}) {
   const { token, onTokenInvalidFormat, onTokenFromDisabledLoginProvider, enabled } = props;
   const [isValid, setIsValid] = useState<boolean>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      if (!enabled) {
         return;
      }

      let tokenInfo = getTokenInfo(token);

      if (token != null && tokenInfo == null) {
         onTokenInvalidFormat();
         setIsValid(false);
         return;
      }

      // This if checks if the user has a token form a login system that is now disabled
      if (
         token != null &&
         ((tokenInfo.provider === AuthenticationProvider.Google && !GOOGLE_LOGIN_ENABLED) ||
            (tokenInfo.provider === AuthenticationProvider.Email && !EMAIL_LOGIN_ENABLED) ||
            (tokenInfo.provider === AuthenticationProvider.Facebook && !FACEBOOK_LOGIN_ENABLED))
      ) {
         onTokenFromDisabledLoginProvider();
         setIsValid(false);
         return;
      }

      let tokenChecker: (token: string) => Promise<TokenCheckResult>;
      switch (tokenInfo?.provider) {
         case AuthenticationProvider.Facebook:
            tokenChecker = checkFacebookToken;
            break;

         case AuthenticationProvider.Google:
            tokenChecker = checkGoogleToken;
            break;

         case AuthenticationProvider.Email:
            tokenChecker = checkEmailToken;
            break;
      }

      setIsLoading(true);

      tokenChecker(token)
         .then(({ valid }) => {
            setIsValid(valid);
            setIsLoading(false);
         })
         .catch(error => {
            setIsValid(false);
            setIsLoading(false);
         });
   }, [enabled, token]);

   return { isValid, isLoading };
}

export function useCustomToken(token?: string) {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [done, setDone] = useState<boolean>(false);

   if (!token) {
      return { isLoading: false, done: true };
   }

   saveOnDevice(LocalStorageKey.AuthenticationToken, token, { secure: true }).then(() => {
      fasterTokenCache = token;
      setDone(true);
      setIsLoading(false);
   });

   return { isLoading, done };
}

/**
 * Calls getNewToken() only once if cannot login but the token is present, has the same effect of
 * the user pressing the login button (once) but without requiring the user to do it. If cannot login
 * after this automatic attempt then the user will need to press the login button next time.
 * In Google login the token becomes invalid too soon, without this hook the user needs to press
 * the login button every couple of days.
 */
function useAutomaticReLogin(params: { token: UseToken; enabled: boolean }) {
   const { token, enabled } = params;
   // Context is used here because this should be executed once per app run, after a failed login attempt we may change the page to Login or reset Login page and local state is lost.
   const { automaticReLoginDone, setAutomaticReLoginDone } = useContext(GlobalContext);
   const tokenProvider = getTokenInfo(token?.token)?.provider;

   useEffect(() => {
      if (
         automaticReLoginDone === true ||
         token?.token == null ||
         enabled !== true ||
         tokenProvider == null ||
         tokenProvider === AuthenticationProvider.Email // This whole hook does not make sens for email login
      ) {
         return;
      }

      token.getNewToken(tokenProvider);
      setAutomaticReLoginDone(true);
   }, [enabled, tokenProvider, token]);
}

export interface UseAuthentication extends UseToken {
   tokenIsValid: boolean;
   logout: () => Promise<void>;
}

export interface UseAuthenticationOptions {
   checkTokenIsValid?: boolean;
   enabled?: boolean;
}

interface UseToken {
   isLoading: boolean;
   token?: string;
   getNewToken: (provider: AuthenticationProvider) => void;
}

interface TokenCheckResult {
   valid: boolean;
}

export function useLogout() {
   const { navigateWithoutHistory } = useNavigation();

   const logout = async () => {
      await removeFromDevice(LocalStorageKey.AuthenticationToken, { secure: true });
      fasterTokenCache = null;
      deleteAllCache();
      navigateWithoutHistory("Login");
   };

   return { logout };
}
