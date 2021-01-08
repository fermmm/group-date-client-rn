import { Alert, BackHandler, ToastAndroid, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import { Linking } from "expo";
import i18n from "i18n-js";

export async function showRejectedPermissionsDialog(
   dialogSettings: RejectedDialogSettings = {}
): Promise<void> {
   dialogSettings.dialogTitle = dialogSettings.dialogTitle || i18n.t("Error");
   dialogSettings.openSettingsButtonText =
      dialogSettings.openSettingsButtonText || i18n.t("Open app settings");
   dialogSettings.exitAppButtonText = dialogSettings.exitAppButtonText || i18n.t("Exit app");
   dialogSettings.dialogText =
      dialogSettings.dialogText || i18n.t("The app cannot continue without");
   dialogSettings.instructionsToastText =
      dialogSettings.instructionsToastText || i18n.t("Touch on Permissions");

   let promiseResolve: () => void = null;
   const resultPromise: Promise<void> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   Alert.alert(
      dialogSettings.dialogTitle,
      dialogSettings.dialogText,
      [
         {
            text: dialogSettings.openSettingsButtonText,
            onPress: async () => {
               await openAppSettings(dialogSettings.instructionsToastText);
               promiseResolve();
            }
         },
         { text: dialogSettings.exitAppButtonText, onPress: () => BackHandler.exitApp() }
      ],
      { cancelable: false }
   );

   return resultPromise;
}

function openAppSettings(instructionsText: string): Promise<unknown> {
   if (Platform.OS === "ios") {
      // TODO: Test this with a IOS device
      return Linking.openURL("app-settings:");
   } else {
      ToastAndroid.show(instructionsText, ToastAndroid.LONG);
      return IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS, {
         data: "package:" + Constants.manifest.android.package
      });
   }
}

export interface RejectedDialogSettings {
   dialogTitle?: string;
   openSettingsButtonText?: string;
   exitAppButtonText?: string;
   dialogText?: string;
   instructionsToastText?: string;
}
