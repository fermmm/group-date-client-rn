import { Alert } from "react-native";

export function showBetaVersionMessage() {
   Alert.alert(
      "",
      "Esta app acaba de ser terminada y es para pruebas. La vamos a difundir después de la pandemia. Puede que no encuentres a nadie por tu zona",
      [
         {
            text: "Entendido"
         }
      ]
   );
}
