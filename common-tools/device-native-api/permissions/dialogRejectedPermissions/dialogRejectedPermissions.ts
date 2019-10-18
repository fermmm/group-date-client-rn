import { Alert, BackHandler, ToastAndroid, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import Constants from "expo-constants";
import { Linking } from "expo";

export async function showRejectedPermissionsDialog(dialogSettings: RejectedDialogSettings = {}): Promise<void> {
   dialogSettings.dialogTitle = dialogSettings.dialogTitle || "Error";
   dialogSettings.openSettingsButtonText = dialogSettings.openSettingsButtonText || "Open app settings";
   dialogSettings.exitAppButtonText = dialogSettings.exitAppButtonText || "Exit app";
   dialogSettings.dialogText = dialogSettings.dialogText || "The app cannot continue without you accepting the required permissions";
   dialogSettings.instructionsToastText = dialogSettings.instructionsToastText || "Click on permissions";

   let promiseResolve: () => void = null;
   const resultPromise: Promise<void> = new Promise((resolve) => {
      promiseResolve = resolve;
   });

   Alert.alert(
      dialogSettings.dialogTitle,
      dialogSettings.dialogText,
      [
         {
            text: dialogSettings.openSettingsButtonText, onPress: async () => {
               await openAppSettings(dialogSettings.instructionsToastText);
               promiseResolve();
            }
         },
         { text: dialogSettings.exitAppButtonText, onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false },
   );

   return resultPromise;
}

function openAppSettings(instructionsText: string): Promise<unknown> {
   if (Platform.OS === "ios") {
      // TODO: Test this with a IOS device
      return Linking.openURL("app-settings:");
   } else {
      ToastAndroid.show(instructionsText, ToastAndroid.LONG);
      return IntentLauncher.startActivityAsync(
         IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
         { data: "package:" + Constants.manifest.android.package },
      );
   }
}

export interface RejectedDialogSettings {
   dialogTitle?: string;
   openSettingsButtonText?: string;
   exitAppButtonText?: string;
   dialogText?: string;
   instructionsToastText?: string;
}