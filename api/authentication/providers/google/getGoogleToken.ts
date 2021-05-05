import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { showRequestErrorAlert } from "../../../tools/showRequestErrorAlert";

WebBrowser.maybeCompleteAuthSession();

export function useGetGoogleToken(): () => Promise<string | null> {
   const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: process.env.GOOGLE_CLIENT_ID_ANDROID,
      expoClientId: process.env.GOOGLE_CLIENT_WEB_EXPO,
      scopes: ["email"]
   });

   const getGoogleToken = async () => {
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

   return getGoogleToken;
}
