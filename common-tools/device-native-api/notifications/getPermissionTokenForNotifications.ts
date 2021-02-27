import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { NotificationChannelInfo } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { PUSH_NOTIFICATIONS_SETTINGS } from "../../../config";

export async function getPermissionTokenForNotifications(
   notificationsChannels: NotificationChannelInfo[]
): Promise<string> {
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
      notificationsChannels.forEach(channelInfo => {
         Notifications.setNotificationChannelAsync(channelInfo.id, {
            name: channelInfo.name,
            importance: PUSH_NOTIFICATIONS_SETTINGS.importance,
            vibrationPattern: PUSH_NOTIFICATIONS_SETTINGS.vibrationPattern,
            lightColor: PUSH_NOTIFICATIONS_SETTINGS.lightColor
         });
      });
   }

   return result;
}
