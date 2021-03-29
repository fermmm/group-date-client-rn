import { mutateCache, useCache } from "../../../api/tools/useCache/useCache";
import {
   NotificationData,
   NotificationType
} from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useSetNotificationAsSeen } from "../../../components/pages/NotificationsPage/tools/useSetNotificationAsSeen";

/**
 * This hook may return a function redirectFromPushNotificationPress, if the function is not null it means the
 * user pressed on a push notification and the app should redirect to corresponding page which is what the
 * function does, after calling it becomes null.
 * You must provide a function that redirects to the provided route. For an easier hook that already handles this
 * use usePushNotificationPressRedirect.
 */
export function usePushNotificationPress(props: {
   redirect: (route: string, params?: object) => void;
}) {
   const { data } = useCache<{ notification: NotificationData }>("notification-press", () => ({
      notification: null
   }));
   const { setNotificationAsSeen } = useSetNotificationAsSeen();
   const { redirect } = props;

   let route: string;
   let params: object;

   if (data?.notification == null) {
      return { redirectFromPushNotificationPress: null };
   }

   switch (data.notification.type) {
      case NotificationType.NearbyPartyOrEvent:
         route = "Main";
         params = { screen: "Notifications" };
         break;
      case NotificationType.Chat:
         route = "Chat";
         params = { groupId: data.notification.targetId };
         break;
      case NotificationType.ContactChat:
         route = "Chat";
         params = { contactChat: true };
         break;
      case NotificationType.Group:
         route = "Group";
         params = { groupId: data.notification.targetId };
         break;
      case NotificationType.About:
         route = "About";
         break;
   }

   return {
      redirectFromPushNotificationPress: () => {
         route != null && redirect(route, params);
         mutateCache("notification-press", { notification: null });
         data.notification.type !== NotificationType.NearbyPartyOrEvent &&
            setNotificationAsSeen(data.notification.notificationId);
         return route != null;
      }
   };
}

export interface UsePushNotificationPress {
   /**
    * Returns true if there is a real redirection, false if no redirection to make
    */
   redirectFromPushNotificationPress?: () => boolean;
}
