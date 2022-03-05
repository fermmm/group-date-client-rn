import { Alert } from "react-native";
import Constants, { AppOwnership } from "expo-constants";

export function showIntroMessage() {
   if (Constants.appOwnership === AppOwnership.Expo) {
      return;
   }

   // Alert.alert(
   //    "",
   //    "Esta app acaba de ser terminada y es para pruebas. La vamos a difundir cuando termine el problema del COVID. Puede que no encuentres a nadie por tu zona",
   //    [
   //       {
   //          text: "Entendido"
   //       }
   //    ]
   // );
}
