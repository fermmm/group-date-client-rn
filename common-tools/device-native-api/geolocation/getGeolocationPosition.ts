import * as Location from "expo-location";
import { showLocationDisabledDialog } from "./dialogLocationDisabled/dialogLocationDisabled";
import { removeDigitsFromNumber } from "../../math/math-tools";
import { tryToGetErrorMessage } from "../../../api/tools/httpRequest";
import { withTimeout } from "../../withTimeout/withTimeout";
import { GetGeolocationParams, LocationCoords } from "./typings";
import { getPermissionStatus } from "../permissions/askForPermissions";

/**
 * Gets geolocation data, the permissions (Permissions.LOCATION) should be already granted, if the geolocation
 * is disabled for other reason (airplane mode or something like that) shows a error dialog requesting the user
 * to fix the problem by disabling airplane mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 *
 * About the location accuracy:
 *
 * If you only require the position in a city precision (not the exact location of the user), we use
 * getCurrentPositionAsync({accuracy: Location.LocationAccuracy.Lowest}) the accuracy it's still
 * very high, so it's better for performance to use getLastKnownPositionAsync() when is available,
 * otherwise we use getCurrentPositionAsync().
 * Getting much lower accuracy "coarse location" like a city level precision seems to be not possible
 * so we "manually" remove digits to get that result, this is better to protect users' privacy.
 *
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function getGeolocationPosition(
   settings?: GetGeolocationParams
): Promise<LocationCoords> {
   const {
      errorMessageCancellable = false,
      enableBackupCoords = true,
      errorDialogSettings = {},
      removePrecisionInCoordinates = true,
      backupCoords
   } = settings ?? {};

   let result: LocationCoords = null;

   try {
      let position = await withTimeout(Location.getLastKnownPositionAsync, {
         rejectOnTimeout: false,
         returnValueOnTimeout: null,
         timeoutMilliseconds: 4000
      });

      if (position == null) {
         position = await withTimeout(
            Location.getCurrentPositionAsync({
               accuracy: removePrecisionInCoordinates
                  ? Location.LocationAccuracy.Lowest
                  : Location.LocationAccuracy.Highest
            })
         );
      }
      result = { ...position.coords };

      if (removePrecisionInCoordinates) {
         result.latitude = removeDigitsFromNumber(result.latitude, {
            digitsToKeepInDecimalPart: 2
         });
         result.longitude = removeDigitsFromNumber(result.longitude, {
            digitsToKeepInDecimalPart: 2
         });
      }

      return Promise.resolve(result);
   } catch (error) {
      console.error(error);

      const permissionGranted = await getPermissionStatus(Location.getForegroundPermissionsAsync);

      let retry: boolean = false;
      // If permissions are granted then we have an error to show to the user, otherwise we know what is happening, no error dialog needed.
      if (permissionGranted) {
         retry = await showLocationDisabledDialog({
            ...errorDialogSettings,
            cancelable: errorMessageCancellable,
            errorDetails: `${
               errorDialogSettings?.errorDetails ? errorDialogSettings?.errorDetails + " " : ""
            }getGeolocationPosition\n${tryToGetErrorMessage(error)}`
         });
      }

      if (retry) {
         return getGeolocationPosition(settings);
      } else {
         if (enableBackupCoords) {
            return Promise.resolve(backupCoords ?? { latitude: 2.0, longitude: -157.39 });
         } else {
            throw new Error(error);
         }
      }
   }
}
