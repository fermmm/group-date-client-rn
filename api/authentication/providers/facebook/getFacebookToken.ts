import { Alert } from "react-native";
import {
   FacebookLoginResult,
   initializeAsync,
   logInWithReadPermissionsAsync,
   logOutAsync
} from "expo-facebook";
import { Flatten } from "../../../../common-tools/ts-tools/common-ts-tools";

/**
 * Retrieves a new token from Facebook, if the user did not authorized the app it shows an authorization screen
 * executed by the Facebook API.
 */
export async function getFacebookToken(): Promise<string | null> {
   try {
      await initializeAsync({
         appId: process.env.FACEBOOK_APP_ID,
         appName: process.env.FACEBOOK_APP_NAME
      });

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
      Alert.alert(
         "No se puede usar Facebook",
         `Primero inicia sesion en la app Facebook. Mensaje: ${message}. `
      );
   }

   return Promise.resolve(null);
}
