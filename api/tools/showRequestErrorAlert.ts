import I18n from "i18n-js";
import { Alert, AlertButton } from "react-native";

export function showRequestErrorAlert(params?: ShowRequestErrorAlertParams) {
   let { title = "", errorMsg = I18n.t("There seems to be a connection problem"), retryFn } =
      params ?? {};

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

   Alert.alert(title, errorMsg, buttons, { cancelable: true });
}

export interface ShowRequestErrorAlertParams {
   /** Default: "" */
   title?: string;
   /** Default: I18n.t("There seems to be a connection problem"); */
   errorMsg?: string;
   retryFn?: () => void;
}
