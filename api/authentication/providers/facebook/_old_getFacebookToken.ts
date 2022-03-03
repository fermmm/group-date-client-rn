/**
 * This uses expo-facebook which is a wrapper around react-native-fbsdk-next. Expo does a horrible job with their login libraries.
 * In this case everything was working until it worked no more, the error message didn't contain useful information and nothing on google,
 * replacing expo-facebook with react-native-fbsdk-next instead worked perfectly. This file contains the old code in case it's useful in
 * the future.
 */

// import { Alert } from "react-native";
// import { FacebookLoginResult, initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
// import { Flatten } from "../../../../common-tools/ts-tools/common-ts-tools";
// import { FACEBOOK_APP_ID, FACEBOOK_APP_NAME } from "../../../../env.config";

// /**
//  * Retrieves a new token from Facebook, if the user did not authorized the app it shows an authorization screen
//  * executed by the Facebook API.
//  */
// export async function getFacebookToken(): Promise<string | null> {
//    try {
//       await initializeAsync({
//          appId: FACEBOOK_APP_ID,
//          appName: FACEBOOK_APP_NAME
//       });

//       let loginResult: FacebookLoginResult = null;

//       loginResult = await logInWithReadPermissionsAsync({
//          permissions: ["public_profile", "email"]
//       });

//       const { type, token }: Flatten<Partial<FacebookLoginResult>> = loginResult ?? {};

//       if (type === "success") {
//          return Promise.resolve(token);
//       } else {
//          // Here the user cancelled the login
//          return Promise.resolve(null);
//       }
//    } catch ({ message }) {
//       Alert.alert(
//          "No se puede usar Facebook",
//          `Primero inicia sesion en la app Facebook. Mensaje: ${message}. `
//       );
//    }

//    return Promise.resolve(null);
// }
