import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Constants, { AppOwnership } from "expo-constants";
import { showRequestErrorAlert } from "../../../tools/showRequestErrorAlert";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useGetGoogleToken(): () => Promise<string | null> {
   const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: process.env.GOOGLE_CLIENT_ID_ANDROID,
      expoClientId: process.env.GOOGLE_CLIENT_WEB_EXPO,
      scopes: ["email"]
   });

   let getGoogleToken: () => Promise<string | null>;

   if (Constants.appOwnership === AppOwnership.Expo) {
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
   } else {
      // This is imported using require() to not break Expo Go
      const { GoogleSignin, statusCodes } = require("@react-native-google-signin/google-signin");

      getGoogleToken = async () => {
         try {
            GoogleSignin.configure();
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();

            if (tokens?.accessToken == null) {
               Alert.alert("Error", "Access token null");
            }

            return tokens.accessToken;
         } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
               // user cancelled the login flow
               Alert.alert("", "statusCodes.SIGN_IN_CANCELLED");
            } else if (error.code === statusCodes.IN_PROGRESS) {
               // operation (e.g. sign in) is in progress already
               Alert.alert("", "statusCodes.IN_PROGRESS");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
               // play services not available or outdated
               Alert.alert("Error", "statusCodes.PLAY_SERVICES_NOT_AVAILABLE");
            } else {
               // some other error happened
               Alert.alert(JSON.stringify(error));
            }
         }

         return null;
      };
   }
   return getGoogleToken;
}
