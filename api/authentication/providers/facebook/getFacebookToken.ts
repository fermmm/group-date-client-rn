import { Alert } from "react-native";
import { LoginManager } from "react-native-fbsdk-next";
import Constants, { AppOwnership } from "expo-constants";
import I18n from "i18n-js";
import { tryToGetErrorMessage } from "../../../tools/httpRequest";

/**
 * Retrieves a new token from Facebook, if the user did not authorized the app it shows an authorization screen
 * executed by the Facebook API.
 */
export async function getFacebookToken(): Promise<string | null> {
   if (Constants.appOwnership === AppOwnership.Expo) {
      Alert.alert("Error", "Facebook login does not work in Expo Go");
      return;
   }

   const { AccessToken, Settings } = require("react-native-fbsdk-next");
   Settings.initializeSDK();

   try {
      const { grantedPermissions, declinedPermissions, isCancelled } =
         await LoginManager.logInWithPermissions(["public_profile", "email"]);

      if (isCancelled) {
         return Promise.resolve(null);
      }

      if (declinedPermissions.length > 0) {
         throw Error(I18n.t("You declined Facebook permissions that are required"));
      }

      const { accessToken } = await AccessToken.getCurrentAccessToken();

      if (accessToken?.length > 2) {
         return Promise.resolve(accessToken);
      } else {
         throw Error("getCurrentAccessToken() returned invalid response");
      }
   } catch (error) {
      Alert.alert(
         I18n.t("Login with Facebook is not possible"),
         `${I18n.t("Maybe you need to login on the Facebook app first")} ${I18n.t(
            "Error message"
         )}: ${tryToGetErrorMessage(error)}`
      );
   }

   // This line should never be reached.
   Alert.alert(
      I18n.t("Login with Facebook is not possible"),
      I18n.t(
         "If you make a screenshot of this error and send it to us that would help a lot thanks"
      )
   );

   return Promise.resolve(null);
}
