import { ToastAndroid, Platform } from "react-native";

export function showNativeFeedbackMessage(
   message: string,
   settings?: { toastAndroidType?: number }
) {
   if (Platform.OS === "ios") {
      // TODO: Implement some feedback for IOS
   } else {
      ToastAndroid.show(message, settings?.toastAndroidType ?? ToastAndroid.LONG);
   }
}
