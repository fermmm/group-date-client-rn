import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import { NotificationChannelInfo } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { PUSH_NOTIFICATIONS_SETTINGS } from "../../../config";

export async function getPermissionTokenForNotifications(
   notificationsChannels: NotificationChannelInfo[]
): Promise<string | null> {
   let result: string;
   if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let status = existingStatus;
      if (status !== "granted") {
         const { status: afterRequestStatus } = await Notifications.requestPermissionsAsync();
         status = afterRequestStatus;
      }
      if (status !== "granted") {
         console.warn("Cannot get permission for push notifications!");
         return null;
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
