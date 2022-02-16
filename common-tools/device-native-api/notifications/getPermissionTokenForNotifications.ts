import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { NotificationChannelInfo } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { PUSH_NOTIFICATIONS_SETTINGS } from "../../../config";

export async function getExpoPushToken(
   notificationsChannels: NotificationChannelInfo[]
): Promise<GetPermissionTokenForNotifications | null> {
   let result: GetPermissionTokenForNotifications;

   if (Device.isDevice) {
      result = {
         notificationsToken: (await Notifications.getExpoPushTokenAsync()).data,
         notificationsArePossible: true
      };
   } else {
      console.warn("Must use physical device for Push Notifications");
      result = {
         notificationsToken: null,
         notificationsArePossible: false
      };
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

interface GetPermissionTokenForNotifications {
   notificationsArePossible: boolean;
   notificationsToken: string;
}
