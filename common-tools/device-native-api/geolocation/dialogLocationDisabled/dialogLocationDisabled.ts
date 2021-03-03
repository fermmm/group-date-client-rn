import { Alert } from "react-native";
import i18n from "i18n-js";

export async function showLocationDisabledDialog(
   dialogSettings: DisabledLocationDialogSettings = {}
): Promise<void> {
   dialogSettings.dialogTitle = dialogSettings.dialogTitle || i18n.t("Error");
   dialogSettings.tryAgainButtonText = dialogSettings.tryAgainButtonText || i18n.t("Try again");
   dialogSettings.useLastOneButtonText =
      dialogSettings.useLastOneButtonText || i18n.t("Use last one");
   dialogSettings.dialogText = dialogSettings.dialogText || i18n.t("Location is not available");
   const cancelable = dialogSettings?.cancelable ?? true;

   let promiseResolve: () => void = null;
   const resultPromise: Promise<void> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   Alert.alert(
      dialogSettings.dialogTitle,
      dialogSettings.dialogText,
      cancelable
         ? [
              { text: dialogSettings.tryAgainButtonText, onPress: () => promiseResolve() },
              { text: dialogSettings.useLastOneButtonText }
           ]
         : [{ text: dialogSettings.tryAgainButtonText, onPress: () => promiseResolve() }],
      { cancelable }
   );

   return resultPromise;
}

export interface DisabledLocationDialogSettings {
   dialogTitle?: string;
   tryAgainButtonText?: string;
   useLastOneButtonText?: string;
   dialogText?: string;
   cancelable?: boolean;
}
