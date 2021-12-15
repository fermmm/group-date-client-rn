import { mutateCache, useCache } from "../../../api/tools/useCache/useCache";
import {
   NotificationData,
   NotificationType
} from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useSetNotificationAsSeen } from "../../../components/pages/NotificationsPage/tools/useSetNotificationAsSeen";

/**
 * If the user pressed a notification, this function will update the notification as seen and provide a function
 * and booleans to redirect and know when to redirect.
 * You must provide a function that redirects to the provided route. For an easier hook that already handles this
 * use usePushNotificationPressRedirect.
 */
export function usePushNotificationPress(props: {
   redirect: (route: string, params?: object) => void;
}): UsePushNotificationPress {
   const { data, isLoading } = useCache<{ notification: NotificationData }>(
      "notification-press",
      () => ({
         notification: null
      })
   );
   const { setNotificationAsSeen } = useSetNotificationAsSeen();
   const { redirect } = props;

   let route: string;
   let params: object;

   if (data?.notification == null) {
      return { isLoading, redirectFromPushNotificationPress: () => {}, shouldRedirect: false };
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

   const redirectFromPushNotificationPress = () => {
      route != null && redirect(route, params);
      mutateCache("notification-press", { notification: null });
      data.notification.type !== NotificationType.NearbyPartyOrEvent &&
         setNotificationAsSeen(data.notification.notificationId);
   };

   return {
      isLoading,
      shouldRedirect: route != null,
      redirectFromPushNotificationPress
   };
}

export interface UsePushNotificationPress {
   isLoading: boolean;
   /**
    * Is true when there is a redirection to make
    */
   shouldRedirect: boolean;
   redirectFromPushNotificationPress?: () => void;
}
