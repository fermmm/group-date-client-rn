import { Alert, Linking, Platform } from "react-native";
import i18n from "i18n-js";

export async function showAddressDisabledDialog(
   dialogSettings: DisabledAddressDialogSettings = {}
): Promise<boolean> {
   const {
      dialogTitle = i18n.t("Error"),
      tryAgainButtonText = i18n.t("Try again"),
      continueButtonText = i18n.t("Continue"),
      dialogText = i18n.t("Address is not available"),
      openSettingsText = i18n.t("Open location settings"),
      cancelable = true,
      errorDetails
   } = dialogSettings ?? {};

   let promiseResolve: (retry: boolean) => void = null;
   const resultPromise: Promise<boolean> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   const handleOpenSettingsPress = () => {
      // This may be better, but probably real users don't have this error.
      // Linking.openURL("app-settings:");
      Linking.openURL("App-Prefs:LOCATION_SERVICES");

      promiseResolve(true);
   };

   Alert.alert(
      dialogTitle,
      `${dialogText}${errorDetails ? `\n\n${i18n.t("Error details")}:\n${errorDetails}` : ""}`,
      [
         { text: openSettingsText, onPress: handleOpenSettingsPress },
         { text: tryAgainButtonText, onPress: () => promiseResolve(true) },
         cancelable && { text: continueButtonText, onPress: () => promiseResolve(false) }
      ],
      { cancelable, onDismiss: cancelable ? () => promiseResolve(false) : null }
   );

   return resultPromise;
}

export interface DisabledAddressDialogSettings {
   dialogTitle?: string;
   tryAgainButtonText?: string;
   continueButtonText?: string;
   openSettingsText?: string;
   dialogText?: string;
   cancelable?: boolean;
   errorDetails?: string;
}
