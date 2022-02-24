import { Alert } from "react-native";
import i18n from "i18n-js";

export async function showLocationDisabledDialog(
   dialogSettings: DisabledLocationDialogSettings = {}
): Promise<boolean> {
   const {
      dialogTitle = i18n.t("Error"),
      tryAgainButtonText = i18n.t("Try again"),
      useLastOneButtonText = i18n.t("Use last one"),
      dialogText = i18n.t("Location is not available"),
      cancelable = true,
      errorDetails
   } = dialogSettings ?? {};

   let promiseResolve: (retry: boolean) => void = null;
   const resultPromise: Promise<boolean> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   Alert.alert(
      dialogTitle,
      `${dialogText}${errorDetails ? `\n\n${i18n.t("Error details")}:\n${errorDetails}` : ""}`,
      cancelable
         ? [
              { text: tryAgainButtonText, onPress: () => promiseResolve(true) },
              { text: useLastOneButtonText, onPress: () => promiseResolve(false) }
           ]
         : [{ text: tryAgainButtonText, onPress: () => promiseResolve(true) }],
      { cancelable, onDismiss: cancelable ? () => promiseResolve(false) : null }
   );

   return resultPromise;
}

export interface DisabledLocationDialogSettings {
   dialogTitle?: string;
   tryAgainButtonText?: string;
   useLastOneButtonText?: string;
   dialogText?: string;
   cancelable?: boolean;
   errorDetails?: string;
}
