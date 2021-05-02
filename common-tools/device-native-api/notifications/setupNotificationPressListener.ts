import { mutateCache } from "../../../api/tools/useCache/useCache";
import * as Notifications from "expo-notifications";
import { NotificationData } from "../../../api/server/shared-tools/endpoints-interfaces/user";

/**
 * This listener is fired whenever a user taps on or interacts with a notification (works when
 * app is foregrounded, backgrounded, or killed). This listener is especially useful for routing
 * users to a particular screen after they tap on a particular notification.
 */

export function setupNotificationPressListener(): void {
   const handler = (event: Notifications.NotificationResponse) => {
      const notification = (event.notification.request.content.data as unknown) as NotificationData;
      mutateCache("notification-press", { notification });
   };

   Notifications.addNotificationResponseReceivedListener(handler);
}
