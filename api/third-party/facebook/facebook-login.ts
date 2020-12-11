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

/**
 * Tries to get the facebook token, first from local storage, if not found and showFacebookLoginIfNeeded = true shows
 * a facebook login screen, if it's not found after showing the screen (user cancelled, API or connection problem)
 * then returns null.
 *
 * If checkStoredTokenIsValid = true makes a request to Facebook to check that the stored token is valid (when it was found stored)
 */
export async function getFacebookToken(props: {
   showFacebookLoginIfNeeded: boolean;
   checkStoredTokenIsValid?: boolean;
}): Promise<string | null> {
   let token: string | null = await tryGetStoredToken(props.checkStoredTokenIsValid);
   if (token == null && props.showFacebookLoginIfNeeded) {
      token = await loginWithFacebook();
   }
   return token;
}

/**
 * Hooks version of getFacebookToken().
 *
 * This hook tries to get the facebook token, first from local storage, if it's null you should call
 * getTokenShowingFacebookScreen function returned by this hook this shows an app login screen from Facebook.
 * After calling getTokenShowingFacebookScreen the token can be still null (user cancelled, API or connection problem)
 *
 * @param checkToken If true makes a request to Facebook to check that the stored token is valid (when it was found stored)
 */
export function useFacebookToken(props: {
   enabled?: boolean;
   checkToken?: boolean;
}): FacebookLoginHook {
   const { enabled, checkToken } = props;

   if (enabled != null && enabled === false) {
      return { isLoading: false, token: null, getTokenByShowingFacebookScreen: () => {} };
   }

   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [token, setToken] = useState<string>(null);

   // Try to get stored token from previous session
   tryGetStoredToken(checkToken || checkToken == null)
      .then(t => {
         setIsLoading(false);
         setToken(t);
      })
      .catch(() => {
         setIsLoading(false);
      });

   const getTokenByShowingFacebookScreen = () => loginWithFacebook().then(t => setToken(t));

   return { isLoading, token, getTokenByShowingFacebookScreen };
}

/**
 * Prompts a facebook login using Facebook API and returns the access token or null if the user didn't login
 */
async function loginWithFacebook(): Promise<string | null> {
   try {
      await initializeAsync(FACEBOOK_APP_ID, FACEBOOK_APP_NAME);
      const loginResult: FacebookLoginResult = await logInWithReadPermissionsAsync({
         permissions: ["public_profile", "email"]
      });

      const { type, token }: Flatten<Partial<FacebookLoginResult>> = loginResult;

      if (type === "success") {
         saveOnDeviceSecure("pdfbtoken", token);
         return Promise.resolve(token);
      } else {
         // here the user cancelled the login
         return Promise.resolve(null);
      }
   } catch ({ message }) {
      Alert.alert("Error con el login de Facebook", message);
   }

   return Promise.resolve(null);
}

/**
 * Calls facebook with a token and checks if valid data returns from it.
 */
async function facebookTokenIsValid(token: string): Promise<boolean> {
   const response: { id: string; name: string } = await httpRequest({
      baseURL: `https://graph.facebook.com/me?access_token=${token}`,
      errorResponseSilent: true
   });
   return Promise.resolve(response?.name != null);
}

/**
 * Tries to get the access token from local storage saved in a previous login
 * @param checkToken If te token is found on local storage makes a request to Facebook in order to check that is valid
 */
async function tryGetStoredToken(checkToken: boolean = true): Promise<string | null> {
   const storedToken: string = await loadFromDeviceSecure("pdfbtoken");
   if (storedToken == null) {
      return Promise.resolve(null);
   }
   if (checkToken && !(await facebookTokenIsValid(storedToken))) {
      return Promise.resolve(null);
   }
   return Promise.resolve(storedToken);
}

export interface FacebookLoginHook {
   isLoading: boolean;
   token?: string;
   getTokenByShowingFacebookScreen: () => void;
}
