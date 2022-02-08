import { Alert, BackHandler } from "react-native";
import { ActivityAction } from "expo-intent-launcher";
import i18n from "i18n-js";
import { openDeviceAction } from "../../device-action/openDeviceAction";

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
               await openDeviceAction(
                  ActivityAction.APPLICATION_DETAILS_SETTINGS,
                  "app-settings:",
                  dialogSettings.instructionsToastText
               );
               promiseResolve();
            }
         },
         { text: dialogSettings.exitAppButtonText, onPress: () => BackHandler.exitApp() }
      ],
      { cancelable: false }
   );

   return resultPromise;
}

export interface RejectedDialogSettings {
   dialogTitle?: string;
   openSettingsButtonText?: string;
   exitAppButtonText?: string;
   dialogText?: string;
   instructionsToastText?: string;
}
