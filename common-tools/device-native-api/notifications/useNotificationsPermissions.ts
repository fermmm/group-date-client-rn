import * as Notifications from "expo-notifications";
import i18n from "i18n-js";
import { usePermission } from "../permissions/askForPermissions";

export function useNotificationPermission(props: { enabled: boolean }) {
   return usePermission(
      {
         getter: () => Notifications.getPermissionsAsync(),
         requester: () => Notifications.requestPermissionsAsync()
      },
      { enabled: props?.enabled ?? true, permissionName: i18n.t("notifications") }
   );
}
