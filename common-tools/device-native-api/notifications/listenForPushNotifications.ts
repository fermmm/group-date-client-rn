import { mutateCache } from "./../../../api/tools/useCache";
import * as Notifications from "expo-notifications";
import { NotificationData } from "../../../api/server/shared-tools/endpoints-interfaces/user";

export function listenForPushNotifications(): void {
   /**
    * This handler determines how your app handles notifications that come in while the app is foregrounded
    */
   Notifications.setNotificationHandler({
      handleNotification: async () => ({
         shouldShowAlert: true,
         shouldPlaySound: false,
         shouldSetBadge: false
      })
   });

   /**
    * This listener is fired whenever a notification is received while the app is foregrounded.
    */
   // const handleNotificationReceived = (notification: Notifications.Notification) => {};

   /**
    * This listener is fired whenever a user taps on or interacts with a notification (works when
    * app is foregrounded, backgrounded, or killed). This listener is especially useful for routing
    * users to a particular screen after they tap on a particular notification.
    */
   const handleNotificationPress = (event: Notifications.NotificationResponse) => {
      const notification = (event.notification.request.content.data as unknown) as NotificationData;
      mutateCache("notification-press", { notification });
   };

   // Notifications.addNotificationReceivedListener(handleNotificationReceived);
   Notifications.addNotificationResponseReceivedListener(handleNotificationPress);
}
