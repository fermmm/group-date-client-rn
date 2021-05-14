import { useCache, UseCacheOptions } from "../tools/useCache/useCache";
import { loadFromDevice, saveOnDevice } from "../../common-tools/device-native-api/storage/storage";
import { useEffect, useRef, useState } from "react";
import { LocalStorageKey } from "../../common-tools/strings/LocalStorageKey";
import { getFacebookToken } from "./providers/facebook/getFacebookToken";
import { checkFacebookToken } from "./providers/facebook/checkFacebookToken";
import { checkGoogleToken } from "./providers/google/checkGoogleToken";
import { useGetGoogleToken } from "./providers/google/getGoogleToken";
import { AuthenticationProvider } from "../server/shared-tools/authentication/AuthenticationProvider";
import {
   createExtendedInfoToken,
   getTokenInfo
} from "../server/shared-tools/authentication/tokenStringTools";

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

   const token = useToken(externallyProvidedToken);
   const { data: tokenCheck, isLoading: tokenCheckLoading } = useTokenCheck(token.token, {
      enabled: checkTokenIsValid && token.token != null && enabled
   });
   useAutomaticReLogin({
      token,
      enabled: tokenCheck?.valid === false && checkTokenIsValid && enabled
   });

   const isLoading =
      token.isLoading || (options?.checkTokenIsValid === true ? tokenCheckLoading : false);

   return {
      token: token.token,
      isLoading,
      tokenIsValid: tokenCheck?.valid,
      getNewToken: token.getNewToken
   };
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
      }

      tokenGetter().then(newToken => {
         if (Boolean(newToken) === false) {
            fasterTokenCache = null;
            setToken(null);
            setIsLoading(false);
            setFetchingNewToken(false);
            return;
         }

         newToken = createExtendedInfoToken({ originalToken: newToken, provider });
         saveOnDevice(LocalStorageKey.AuthenticationToken, newToken, { secure: true }).then(() => {
            // console.log("new token: ", newToken);
            fasterTokenCache = newToken;
            setToken(newToken);
            setIsLoading(false);
            setFetchingNewToken(false);
         });
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
      loadFromDevice(LocalStorageKey.AuthenticationToken, { secure: true }).then(
         tokenFromDevice => {
            setIsLoading(false);
            if (tokenFromDevice == null) {
               return;
            }
            fasterTokenCache = tokenFromDevice;
            setToken(tokenFromDevice);
         }
      );
   }

   return { token, isLoading, getNewToken };
}

/**
 * Uses the token to get some user information from Provider API and if the information is returned it
 * means the token is valid. It's better to check this on the client than on the server, dealing with
 * an extra server error is more complex. If the token is not valid then getNewToken() should be called.
 */
function useTokenCheck(token: string, config?: UseCacheOptions<TokenCheckResult>) {
   let tokenInfo = getTokenInfo(token);

   let tokenChecker: (token: string) => Promise<TokenCheckResult>;
   switch (tokenInfo?.provider) {
      case AuthenticationProvider.Facebook:
         tokenChecker = checkFacebookToken;
         break;

      case AuthenticationProvider.Google:
         tokenChecker = checkGoogleToken;
         break;
   }

   return useCache<TokenCheckResult>(
      `tokenCheck${token}`,
      () => tokenChecker(tokenInfo.originalToken),
      config
   );
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
   const attemptedSilentLogin = useRef(false);

   useEffect(() => {
      if (attemptedSilentLogin.current === true || token?.token == null || enabled !== true) {
         return;
      }
      let tokenInfo = getTokenInfo(token.token);
      token.getNewToken(tokenInfo.provider);
      attemptedSilentLogin.current = true;
   }, [enabled]);
}

export interface UseAuthentication extends UseToken {
   tokenIsValid: boolean;
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
