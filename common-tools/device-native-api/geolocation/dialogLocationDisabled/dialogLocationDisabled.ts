import { Alert } from "react-native";

export async function showLocationDisabledDialog(dialogSettings: DisabledLocationDialogTexts = {}): Promise<void> {
   dialogSettings.dialogTitle = dialogSettings.dialogTitle || "Error";
   dialogSettings.tryAgainButtonText = dialogSettings.tryAgainButtonText || "Try again";
   dialogSettings.dialogText = dialogSettings.dialogText || "Location is not avaiable, check if it's disabled or if Airplane mode is enabled";
   
   let promiseResolve: () => void = null;
   const resultPromise: Promise<void> = new Promise((resolve) => {
      promiseResolve = resolve;
   });

   Alert.alert(
      dialogSettings.dialogTitle,
      dialogSettings.dialogText,
      [
         { text: dialogSettings.tryAgainButtonText, onPress: () => promiseResolve()},
      ],
      { cancelable: false },
   );

   return resultPromise;
}

export interface DisabledLocationDialogTexts {
   dialogTitle?: string;
   tryAgainButtonText?: string;
   dialogText?: string;
}
