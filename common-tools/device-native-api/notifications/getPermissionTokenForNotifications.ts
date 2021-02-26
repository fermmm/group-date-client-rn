import { PUSH_NOTIFICATIONS_CHANNELS } from "../../../config";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function getPermissionTokenForNotifications(): Promise<string> {
   let result: string;
   if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== "granted") {
         console.warn("Failed to get push token for push notification!");
         return;
      }
      result = (await Notifications.getExpoPushTokenAsync()).data;
   } else {
      console.warn("Must use physical device for Push Notifications");
   }

   if (Platform.OS === "android") {
      PUSH_NOTIFICATIONS_CHANNELS.forEach(channelInfo => {
         Notifications.setNotificationChannelAsync(channelInfo.id, channelInfo);
      });
   }

   return result;
}
