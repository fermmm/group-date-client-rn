import * as Location from "expo-location";
import i18n from "i18n-js";
import { askForPermission, AskPermissionSettings } from "../permissions/askForPermissions";

export async function askGeolocationPermission(settings?: AskPermissionSettings) {
   return await askForPermission(
      {
         getter: () => Location.getForegroundPermissionsAsync(),
         requester: () => Location.requestForegroundPermissionsAsync()
      },
      { ...settings, permissionName: i18n.t("location") }
   );
}
