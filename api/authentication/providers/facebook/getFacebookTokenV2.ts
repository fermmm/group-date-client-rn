import { Alert } from "react-native";
import { AccessToken, Settings } from "react-native-fbsdk-next";
import { LoginManager } from "react-native-fbsdk-next";
import I18n from "i18n-js";
import { tryToGetErrorMessage } from "../../../tools/httpRequest";

// This is here because the documentation says it should be executed as early as possible.
Settings.initializeSDK();

/**
 * Retrieves a new token from Facebook, if the user did not authorized the app it shows an authorization screen
 * executed by the Facebook API.
 */
export async function getFacebookToken(): Promise<string | null> {
   try {
      const { grantedPermissions, declinedPermissions, isCancelled } =
         await LoginManager.logInWithPermissions(["public_profile", "email"]);

      if (isCancelled) {
         return Promise.resolve(null);
      }

      if (declinedPermissions || !grantedPermissions) {
         throw Error(I18n.t("You declined permissions"));
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
         I18n.t("Maybe you need to login on the Facebook app first. Error message") +
            ": " +
            tryToGetErrorMessage(error)
      );
   }

   // This line should never be reached.
   Alert.alert(
      I18n.t("Login with Facebook is not possible"),
      I18n.t(
         "If you make a screenshot of this error and send it to us that would help a lot thanks."
      )
   );

   return Promise.resolve(null);
}
