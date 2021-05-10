import { Notification } from "./../../../../api/server/shared-tools/endpoints-interfaces/user";
import { useEffect, useState } from "react";
import { useNotifications } from "../../../../api/server/user";
import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { NOTIFICATIONS_REFRESH_INTERVAL } from "../../../../config";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";
import { useSetNotificationAsSeen } from "./useSetNotificationAsSeen";

export function useNotificationsInfo() {
   const {
      value: seenNotificationsIds,
      isLoading: loadingSeenNotifications,
      setValue,
      refresh
   } = useLocalStorage<string[]>(LocalStorageKey.SeenNotificationsIds);

   const {
      setNotificationAsSeen,
      isLoading: loadingSetNotificationsAsSeen
   } = useSetNotificationAsSeen();

   const { data: notifications } = useNotifications({
      config: {
         refreshInterval: NOTIFICATIONS_REFRESH_INTERVAL
      }
   });

   const [seenNotifications, setSeenNotifications] = useState<Notification[]>([]);
   const [notSeenNotifications, setNotSeenNotifications] = useState<Notification[]>([]);

   const isLoading =
      loadingSetNotificationsAsSeen || loadingSeenNotifications || notifications == null;

   useEffect(() => {
      if (isLoading || !notifications) {
         return;
      }

      setSeenNotifications(
         notifications.filter(notification =>
            seenNotificationsIds?.includes(notification.notificationId)
         )
      );
      setNotSeenNotifications(
         notifications.filter(
            notification => !seenNotificationsIds?.includes(notification.notificationId)
         )
      );
   }, [isLoading, seenNotificationsIds, notifications]);

   const setAllNotificationsAsSeen = async () => {
      if (notifications == null) {
         return;
      }
      setValue(
         notifications.map(n => n.notificationId),
         true
      );
   };

   return {
      isLoading,
      notifications,
      seenNotifications,
      notSeenNotifications,
      seenNotificationsIds,
      setNotificationAsSeen,
      setAllNotificationsAsSeen,
      refresh
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
   refresh: () => void;
}
