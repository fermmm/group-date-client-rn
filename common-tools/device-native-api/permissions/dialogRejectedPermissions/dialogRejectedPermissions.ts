import { Alert, AlertButton, BackHandler, Platform } from "react-native";
import { ActivityAction } from "expo-intent-launcher";
import i18n from "i18n-js";
import { openDeviceAction } from "../../device-action/openDeviceAction";

export async function showRejectedPermissionsDialog(
   dialogSettings: RejectedDialogSettings = {}
): Promise<void> {
   const {
      dialogTitle = i18n.t("Error"),
      openSettingsButtonText = i18n.t("Open app settings"),
      dialogText = i18n.t("The app only works if you accept"),
      instructionsToastText = i18n.t("Touch on Permissions"),
      retryButtonText = i18n.t("I fixed it"),
      permissionName,
      showContinueAnywayButton
   } = dialogSettings;

   let promiseResolve: () => void = null;
   const resultPromise: Promise<void> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   const buttons: AlertButton[] = [
      {
         text: openSettingsButtonText,
         onPress: async () => {
            await openDeviceAction(
               ActivityAction.APPLICATION_DETAILS_SETTINGS,
               "app-settings:",
               instructionsToastText
            );
            promiseResolve();
         }
      },
      {
         text: retryButtonText,
         onPress: () => {
            promiseResolve();
         }
      }
   ];

   if (showContinueAnywayButton) {
      buttons.push({
         text: permissionName
            ? `${i18n.t("Continue without")} ${permissionName}`
            : i18n.t("Continue anyway"),
         onPress: () => {
            promiseResolve();
         },
         style: "cancel"
      });
   }

   Alert.alert(
      dialogTitle,
      `${dialogText}${permissionName ? `: ${permissionName}` : ""}`,
      buttons,
      { cancelable: false }
   );

   return resultPromise;
}

export interface RejectedDialogSettings {
   dialogTitle?: string;
   openSettingsButtonText?: string;
   dialogText?: string;
   instructionsToastText?: string;
   retryButtonText?: string;
   permissionName?: string;
   showContinueAnywayButton?: boolean;
}
