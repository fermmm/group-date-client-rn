import { Alert } from "react-native";
import i18n from "i18n-js";

export async function showLocationDisabledDialog(
   dialogSettings: DisabledLocationDialogTexts = {}
): Promise<void> {
   dialogSettings.dialogTitle = dialogSettings.dialogTitle || i18n.t("Error");
   dialogSettings.tryAgainButtonText = dialogSettings.tryAgainButtonText || i18n.t("Try again");
   dialogSettings.dialogText =
      dialogSettings.dialogText ||
      i18n.t("Location is not available, check if it's disabled or if Airplane mode is enabled");

   let promiseResolve: () => void = null;
   const resultPromise: Promise<void> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   Alert.alert(
      dialogSettings.dialogTitle,
      dialogSettings.dialogText,
      [{ text: dialogSettings.tryAgainButtonText, onPress: () => promiseResolve() }],
      { cancelable: false }
   );

   return resultPromise;
}

export interface DisabledLocationDialogTexts {
   dialogTitle?: string;
   tryAgainButtonText?: string;
   dialogText?: string;
}
