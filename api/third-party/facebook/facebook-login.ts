import { useCache, UseCacheOptions } from "../../tools/useCache/useCache";
import { FacebookLoginResult, initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
import { Alert } from "react-native";
import { Flatten } from "../../../common-tools/ts-tools/common-ts-tools";
import { FACEBOOK_APP_ID, FACEBOOK_APP_NAME } from "@env";
import {
   loadFromDevice,
   saveOnDevice
} from "../../../common-tools/device-native-api/storage/storage";
import { httpRequest } from "../../tools/httpRequest";
import { useState } from "react";
import { LocalStorageKey } from "../../../common-tools/strings/LocalStorageKey";

let fasterTokenCache: string = null;

/**
 * This hook tries to get the facebook token, first from the parameter, if not present tries from local storage, if it's
 * still null you should call getNewTokenFromFacebook() function returned by this hook this shows an authorize screen from
 * Facebook if necessary. After calling getNewTokenFromFacebook() the token can be still null (user cancelled, API or
 * connection problem)
 */
export function useFacebookToken(externallyProvidedToken?: string): UseFacebookTokenHook {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [token, setToken] = useState<string>(externallyProvidedToken);

   const getNewTokenFromFacebook = () =>
      getTokenFromFacebook().then(t => {
         saveOnDevice(LocalStorageKey.FacebookToken, t, { secure: true });
         fasterTokenCache = t;
         setToken(t);
      });

   if (externallyProvidedToken != null || token != null) {
      return { token: externallyProvidedToken ?? token, isLoading: false, getNewTokenFromFacebook };
   }

   if (fasterTokenCache != null) {
      return { token: fasterTokenCache, isLoading: false, getNewTokenFromFacebook };
   }

   // Try to get stored token from previous session
   loadFromDevice(LocalStorageKey.FacebookToken, { secure: true })
      .then(t => {
         setIsLoading(false);
         fasterTokenCache = t;
         setToken(t);
      })
      .catch(() => {
         setIsLoading(false);
      });

   return { token, isLoading, getNewTokenFromFacebook };
}

/**
 * Retrieves a new token from Facebook, if the user did not authorized the app it shows an authorization screen
 * executed by the Facebook API.
 */
async function getTokenFromFacebook(): Promise<string | null> {
   try {
      await initializeAsync({ appId: FACEBOOK_APP_ID, appName: FACEBOOK_APP_NAME });

      let loginResult: FacebookLoginResult = null;

      loginResult = await logInWithReadPermissionsAsync({
         permissions: ["public_profile", "email"]
      });

      const { type, token }: Flatten<Partial<FacebookLoginResult>> = loginResult ?? {};

      if (type === "success") {
         return Promise.resolve(token);
      } else {
         // Here the user cancelled the login
         return Promise.resolve(null);
      }
   } catch ({ message }) {
      Alert.alert("Facebook login: ", message);
   }

   return Promise.resolve(null);
}

/**
 * Uses the token to get some user information from Facebook and if the information is returned it means
 * the token is valid. It's better to check this on the client than on the server, dealing with an extra
 * server error is more complex. If the token is not valid then getTokenFromFacebook() should be called
 * to get a new token from Facebook.
 */
export function useFacebookTokenCheck(token: string, config?: UseCacheOptions<boolean>) {
   return useCache<boolean>(
      `graph.facebook.com/me?access_token=${token}`,
      async () => {
         const response: { id: string; name: string } = await httpRequest({
            baseURL: `https://graph.facebook.com/me?access_token=${token}`,
            errorResponseSilent: true,
            handleErrors: true
         });

         return response?.name != null;
      },
      { ...config }
   );
}

export interface UseFacebookTokenHook {
   isLoading: boolean;
   token?: string;
   getNewTokenFromFacebook: () => void;
}
