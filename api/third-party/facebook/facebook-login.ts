import { FacebookLoginResult, initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
import { Alert } from "react-native";
import { Flatten } from "../../../common-tools/ts-tools/common-ts-tools";
import { FACEBOOK_APP_ID, FACEBOOK_APP_NAME } from "react-native-dotenv";
import { saveOnDeviceSecure } from "../../../common-tools/device-native-api/storage/storage";
import { httpRequest } from "../../tools/httpRequest";

export async function loginWithFacebook(): Promise<string | null> {
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

export async function facebookTokenIsValid(token: string): Promise<boolean> {
   const response: { id: string; name: string } = await httpRequest({
      baseURL: `https://graph.facebook.com/me?access_token=${token}`,
      errorResponseSilent: true
   });
   return Promise.resolve(response?.name != null);
}
