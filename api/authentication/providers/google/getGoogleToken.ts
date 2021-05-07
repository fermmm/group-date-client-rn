import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as GoogleSignIn from "expo-google-sign-in";
import * as AuthSession from "expo-auth-session";
import Constants, { AppOwnership } from "expo-constants";
import { showRequestErrorAlert } from "../../../tools/showRequestErrorAlert";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useGetGoogleToken(): () => Promise<string | null> {
   const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: process.env.GOOGLE_CLIENT_ID_ANDROID,
      expoClientId: process.env.GOOGLE_CLIENT_WEB_EXPO,
      webClientId: "537335782337-n8brea1hrb4fh0h0u00hud7f94mm237m.apps.googleusercontent.com",
      scopes: ["email"]
   });

   let getGoogleToken: () => Promise<string | null>;

   useEffect(() => {}, []);

   if (Constants.appOwnership === AppOwnership.Standalone) {
      getGoogleToken = async () => {
         const resp = await promptAsync({
            showInRecents: true
         });
         Alert.alert("", `Resp.type: ${JSON.stringify(resp?.type)}`);
         if (resp?.type === "success") {
            const { authentication } = resp;
            return authentication.accessToken;
         }

         /*
         try {
            await GoogleSignIn.initAsync({
               clientId: process.env.GOOGLE_CLIENT_ID_ANDROID,
               scopes: ["email"]
            });
         } catch ({ message }) {
            Alert.alert("", "Error in GoogleSignIn.initAsync(): " + message);
         }
         
         try {
            // await GoogleSignIn.signOutAsync();
         } catch ({ message }) {
            Alert.alert("", `signOutAsync() error: ${JSON.stringify(message)}`);
         }
         try {
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === "success") {
               return user?.auth?.accessToken;
            }
         } catch ({ message }) {
            Alert.alert("", `Login error: ${JSON.stringify(message)}`);
         }
         */
      };
   } else {
      getGoogleToken = async () => {
         try {
            const resp = await promptAsync();
            if (resp?.type === "success") {
               const { authentication } = resp;
               return authentication.accessToken;
            }
         } catch (error) {
            showRequestErrorAlert({ errorMsg: String(error) });
         }
      };
   }
   return getGoogleToken;
}
