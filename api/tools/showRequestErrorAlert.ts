import I18n from "i18n-js";
import { Alert, AlertButton } from "react-native";

export function showRequestErrorAlert(params: { errorMsg: string; retryFn?: () => void }) {
   const { errorMsg, retryFn } = params;
   let buttons: AlertButton[];
   if (retryFn != null) {
      buttons = [
         {
            text: I18n.t("Cancel")
         },
         {
            text: I18n.t("Try again"),
            onPress: retryFn
         }
      ];
   } else {
      buttons = [
         {
            text: I18n.t("OK")
         }
      ];
   }

   Alert.alert("", errorMsg, buttons, { cancelable: true });
}
