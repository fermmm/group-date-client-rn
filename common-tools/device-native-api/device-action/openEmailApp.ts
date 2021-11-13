import Constants, { AppOwnership } from "expo-constants";
import { Alert } from "react-native";

export function openEmailApp() {
   if (Constants.appOwnership === AppOwnership.Expo) {
      // In this case is better to keep this Alert instead of a custom one.
      Alert.alert("", "This feature is only available in compiled app, not in Expo Go");
      return;
   }

   // This is imported using require() to not break Expo Go
   const { openInbox } = require("react-native-email-link");
   openInbox();
}
