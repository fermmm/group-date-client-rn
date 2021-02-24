import { Notification } from "./../../../../api/server/shared-tools/endpoints-interfaces/user";
import { useCallback, useEffect, useRef } from "react";
import { useNotifications } from "../../../../api/server/user";
import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { NOTIFICATIONS_REFRESH_INTERVAL } from "../../../../config";

export function useNotificationsInfo() {
   const {
      value: seenNotificationsIds,
      isLoading: loadingSeenNotifications,
      setValue,
      refresh
   } = useLocalStorage<string[]>("seenNotificationsIds");

   const { data: notifications } = useNotifications({
      config: {
         refreshInterval: NOTIFICATIONS_REFRESH_INTERVAL
      }
   });

   const seenNotifications = useRef<Notification[]>([]);
   const notSeenNotifications = useRef<Notification[]>([]);

   const isLoading = loadingSeenNotifications || notifications == null;

   useEffect(() => {
      seenNotifications.current = notifications?.filter(
         notification => !isLoading && seenNotificationsIds?.includes(notification.notificationId)
      );
      notSeenNotifications.current = notifications?.filter(
         notification => !isLoading && !seenNotificationsIds?.includes(notification.notificationId)
      );
   }, [isLoading, seenNotificationsIds]);

   const setNotificationAsSeen = useCallback(
      async (notificationId: string) => {
         if (!seenNotificationsIds?.includes(notificationId)) {
            await setValue([...(seenNotificationsIds ?? []), notificationId]);
            refresh();
         }
      },
      [seenNotificationsIds]
   );

   const setAllNotificationsAsSeen = useCallback(async () => {
      if (notifications == null) {
         return;
      }
      await setValue(notifications.map(n => n.notificationId));
      refresh();
   }, [notifications]);

   return {
      isLoading,
      notifications,
      seenNotifications: seenNotifications.current,
      notSeenNotifications: notSeenNotifications.current,
      seenNotificationsIds,
      setNotificationAsSeen,
      setAllNotificationsAsSeen
   };
}

export interface UseNotificationsInfo {
   isLoading: boolean;
   notifications: Notification[];
   seenNotifications: Notification[];
   notSeenNotifications: Notification[];
   seenNotificationsIds?: string[];
   setNotificationAsSeen: (notificationId: string) => void;
   setAllNotificationsAsSeen: () => void;
}
