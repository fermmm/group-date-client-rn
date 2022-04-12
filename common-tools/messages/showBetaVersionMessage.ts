import { Alert } from "react-native";
import Constants, { AppOwnership } from "expo-constants";
import { useServerInfo } from "../../api/server/server-info";

export function useIntroMessage() {
   const { data } = useServerInfo();

   return {
      showIntroMessage: () => {
         if (Constants.appOwnership === AppOwnership.Expo) {
            return;
         }

         if (data?.postLoginMessage == null || data?.postLoginMessage?.length < 1) {
            return;
         }

         Alert.alert("", data.postLoginMessage, [
            {
               text: "Entendido"
            }
         ]);
      }
   };
}
