import * as Location from "expo-location";
import { tryToGetErrorMessage } from "../../../api/tools/httpRequest";
import { tryToStringifyObject } from "../../debug-tools/tryToStringifyObject";
import { showAddressDisabledDialog } from "./dialogAddressDisabled/dialogAddressDisabled";
import { withTimeout } from "../../withTimeout/withTimeout";
import { GetGeolocationParams, LocationCoords } from "./typings";
import { getPermissionStatus } from "../permissions/askForPermissions";

/**
 * Gets geolocation data, the permissions (Permissions.LOCATION) should be already granted, if the geolocation
 * is disabled for other reason (airplane mode or something like that) shows a error dialog requesting the user
 * to fix the problem by disabling airplane mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 * For some locations this function demonstrated to be not reliable, the app should be able to continue without
 * the information returned here.
 * About the permission:
 * Sadly this function requires full accurate Location permissions on Android because is required by reverseGeocodeAsync()
 *
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function getGeolocationAddress(
   coords: LocationCoords,
   settings?: GetGeolocationParams
): Promise<Location.LocationGeocodedAddress> {
   const {
      errorMessageCancellable = false,
      errorDialogSettings = {},
      showError = true
   } = settings ?? {};

   try {
      let reverseGeocoding: Location.LocationGeocodedAddress[];

      try {
         reverseGeocoding = await withTimeout(Location.reverseGeocodeAsync(coords));
      } catch (e) {
         throw new Error("Location.reverseGeocodeAsync failed:\n" + tryToGetErrorMessage(e));
      }

      let result: Location.LocationGeocodedAddress = null;
      if (
         reverseGeocoding != null &&
         Array.isArray(reverseGeocoding) &&
         reverseGeocoding.length > 0
      ) {
         result = reverseGeocoding[0];
      } else {
         throw new Error(
            "Location.reverseGeocodeAsync returned unexpected response:\n" +
               tryToStringifyObject(reverseGeocoding)
         );
      }

      return Promise.resolve(result);
   } catch (error) {
      console.error(error);

      const permissionGranted = await getPermissionStatus(Location.getForegroundPermissionsAsync);

      if (permissionGranted === false && errorMessageCancellable) {
         return Promise.resolve(null);
      }

      let retry = false;

      if (showError) {
         retry = await showAddressDisabledDialog({
            ...errorDialogSettings,
            errorDetails: `${
               errorDialogSettings?.errorDetails ? errorDialogSettings?.errorDetails + " " : ""
            }getGeolocationAddress\n${tryToStringifyObject(coords)}\n${tryToGetErrorMessage(
               error
            )}`,
            cancelable: true
         });
      }

      if (retry) {
         return getGeolocationAddress(coords, settings);
      } else {
         throw new Error(error);
      }
   }
}
