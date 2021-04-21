import I18n from "i18n-js";
import { Alert, AlertButton } from "react-native";

export function showRequestErrorAlert(params?: ShowRequestErrorAlertParams) {
   let {
      title = "",
      errorMsg = I18n.t("There seems to be a connection problem"),
      retryFn,
      onCancel,
      onClose
   } = params ?? {};

   let buttons: AlertButton[];
   if (retryFn != null) {
      buttons = [
         {
            text: I18n.t("Cancel"),
            onPress: () => {
               if (onCancel != null) {
                  onCancel();
               }
               if (onClose != null) {
                  onClose();
               }
            }
         },
         {
            text: I18n.t("Try again"),
            onPress: () => {
               retryFn();
               if (onClose != null) {
                  onClose();
               }
            }
         }
      ];
   } else {
      buttons = [
         {
            text: I18n.t("OK"),
            onPress: () => {
               if (onCancel != null) {
                  onCancel();
               }
               if (onClose != null) {
                  onClose();
               }
            }
         }
      ];
   }

   Alert.alert(title, errorMsg, buttons, { cancelable: false });
}

export interface ShowRequestErrorAlertParams {
   /** Default: "" */
   title?: string;
   /** Default: I18n.t("There seems to be a connection problem"); */
   errorMsg?: string;
   retryFn?: () => void;
   onCancel?: () => void;
   onClose?: () => void;
}
