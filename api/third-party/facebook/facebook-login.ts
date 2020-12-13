import { FacebookLoginResult, initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
import { Alert } from "react-native";
import { Flatten } from "../../../common-tools/ts-tools/common-ts-tools";
import { FACEBOOK_APP_ID, FACEBOOK_APP_NAME } from "react-native-dotenv";
import {
   loadFromDeviceSecure,
   saveOnDeviceSecure
} from "../../../common-tools/device-native-api/storage/storage";
import { httpRequest } from "../../tools/httpRequest";
import { useState } from "react";
import { QueryConfig, useQuery } from "react-query";

/**
 * This hook tries to get the facebook token, first from local storage, if it's null you should call
 * getNewTokenFromFacebook() function returned by this hook this shows an authorize screen from Facebook if necessary.
 * After calling getNewTokenFromFacebook() the token can be still null (user cancelled, API or connection problem)
 */
let fasterTokenCache: string = null;
export function useFacebookToken(): UseFacebookTokenHook {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [token, setToken] = useState<string>(null);

   const getNewTokenFromFacebook = () =>
      getTokenFromFacebook().then(t => {
         saveOnDeviceSecure("pdfbtoken", t);
         setToken(t);
         fasterTokenCache = t;
      });

   if (fasterTokenCache != null) {
      return { token: fasterTokenCache, isLoading: false, getNewTokenFromFacebook };
   }

   // Try to get stored token from previous session
   loadFromDeviceSecure("pdfbtoken")
      .then(t => {
         setIsLoading(false);
         setToken(t);
         fasterTokenCache = t;
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
 * the token is valid. It's better to check this on th client than on the server, dealing with an extra
 * server error is more complex. If the token is not valid then getTokenFromFacebook() should be called
 * to get a new token from Facebook.
 */
export function useFacebookTokenCheck(token: string, config?: QueryConfig<boolean>) {
   const response = useQuery<boolean>(
      [`graph.facebook.com/me?access_token=${token}`, "GET"],
      async () => {
         const response: { id: string; name: string } = await httpRequest({
            baseURL: `https://graph.facebook.com/me?access_token=${token}`,
            errorResponseSilent: true,
            handleErrors: true
         });

         return response?.name != null;
      },
      { staleTime: 0, ...config }
   );
   return response;
}

export interface UseFacebookTokenHook {
   isLoading: boolean;
   token?: string;
   getNewTokenFromFacebook: () => void;
}
