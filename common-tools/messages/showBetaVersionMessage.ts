import { Alert } from "react-native";
import Constants, { AppOwnership } from "expo-constants";

export function showIntroMessage() {
   if (Constants.appOwnership === AppOwnership.Expo) {
      return;
   }

   Alert.alert(
      "",
      "Esta app acaba de ser terminada y ahora estamos planificando la difusión. Puede que aún no encuentres a nadie por tu zona",
      [
         {
            text: "Entendido"
         }
      ]
   );
}
