import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";

export function useSetNotificationAsSeen() {
   const { value: seenNotificationsIds, isLoading, setValue } = useLocalStorage<string[]>(
      LocalStorageKey.SeenNotificationsIds
   );

   const setNotificationAsSeen = (notificationId: string) => {
      if (!seenNotificationsIds?.includes(notificationId)) {
         setValue([...(seenNotificationsIds ?? []), notificationId], true);
      }
   };

   return { isLoading, setNotificationAsSeen };
}

export interface UseSetNotificationAsSeen {
   isLoading: boolean;
   setNotificationAsSeen: (notificationId: string) => void;
}
