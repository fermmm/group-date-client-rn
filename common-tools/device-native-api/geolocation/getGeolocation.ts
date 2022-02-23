import { useMemo } from "react";
import { useLocalStorage } from "./../storage/useLocalStorage";
import { useCache } from "../../../api/tools/useCache/useCache";
import * as Location from "expo-location";
import i18n from "i18n-js";
import {
   showLocationDisabledDialog,
   DisabledLocationDialogSettings
} from "./dialogLocationDisabled/dialogLocationDisabled";
import { usePermission } from "../permissions/askForPermissions";
import { LocalStorageKey } from "../../strings/LocalStorageKey";
import { removeDigitsFromNumber } from "../../math/math-tools";
import { tryToGetErrorMessage } from "../../../api/tools/httpRequest";
import { tryToStringifyObject } from "../../debug-tools/tryToStringifyObject";
import { showAddressDisabledDialog } from "./dialogAddressDisabled/dialogAddressDisabled";

/**
 * Gets geolocation data, asks for permissions Permissions.LOCATION. If the geolocation
 * is disabled for a reason other than the permissions (airplane mode or something like that)
 * then it shows a error dialog requesting the user to fix the problem by disabling airplane
 * mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function useGeolocation(settings?: GetGeolocationParams): UseGeolocation {
   const permissionGranted = usePermission(
      {
         getter: () => Location.getForegroundPermissionsAsync(),
         requester: () => Location.requestForegroundPermissionsAsync()
      },
      { enabled: settings?.enabled ?? true, permissionName: i18n.t("location") }
   );

   const { coords, isLoading: coordsLoading } = useGeolocationCoords({
      permissionGranted,
      settings
   });

   const { address, isLoading: addressIsLoading } = useAddress({
      permissionGranted,
      coords,
      settings
   });

   return useMemo(
      () => ({
         isLoading: coordsLoading || addressIsLoading,
         geolocation: {
            coords,
            address
         }
      }),
      [coords, address, coordsLoading, addressIsLoading]
   );
}

/**
 * Requests the geolocation coords and caches them during all the session.
 * This requires Permissions.LOCATION to be granted, when granted you pass permissionGranted as true.
 */
function useGeolocationCoords(params: {
   permissionGranted: boolean;
   settings?: GetGeolocationParams;
}) {
   const { permissionGranted, settings } = params;

   const {
      value: storedCoords,
      setValue: setStoredCoords,
      isLoading: localStorageIsLoading
   } = useLocalStorage<LocationCoords>(LocalStorageKey.GeolocationCoords);

   const {
      data: coords,
      error,
      isLoading
   } = useCache(
      "_geolocationPos_",
      () =>
         getGeolocationPosition({
            ...settings,
            errorDialogSettings: { cancelable: storedCoords != null }
         }),
      {
         enabled: permissionGranted === true && !localStorageIsLoading,
         onSuccess: coords => setStoredCoords(coords)
      }
   );

   return {
      isLoading: isLoading || localStorageIsLoading,
      coords: error == null ? coords : storedCoords
   };
}

/**
 * Gets the geolocation address. Uses the reverse geocoding Android API, this API has a limit in the amount of
 * requests so this hook uses a local storage cache. When the coordinates changed from the stored numbers it
 * requests the address again, otherwise returns the cache.
 * This requires Permissions.LOCATION to be granted, when granted you pass permissionGranted as true.
 */
function useAddress(params: {
   permissionGranted: boolean;
   coords: LocationCoords;
   settings?: GetGeolocationParams;
}) {
   const { permissionGranted, coords, settings } = params;

   const {
      value: storedGeolocation,
      setValue: setStoredGeolocation,
      isLoading: loadingStoredGeolocation
   } = useLocalStorage<LocationData>(LocalStorageKey.GeolocationAddress);

   // Stored geolocation is different than current
   const locationChanged =
      coords?.latitude !== storedGeolocation?.coords?.latitude ||
      coords?.longitude !== storedGeolocation?.coords?.longitude;

   const requirementsOk =
      permissionGranted === true && coords != null && loadingStoredGeolocation !== true;

   // Request the cache if the stored location is different than current or when there is no cache
   const shouldRequestAddress =
      (locationChanged || storedGeolocation?.address == null) && requirementsOk;

   const {
      data: requestedAddress,
      error,
      isLoading: requesterIsLoading
   } = useCache("_geolocationAddress_", () => getGeolocationAddress(coords, settings), {
      enabled: shouldRequestAddress,
      onSuccess: address => setStoredGeolocation({ coords, address }),
      showAlertOnError: false
   });

   return {
      isLoading: requesterIsLoading || loadingStoredGeolocation,
      address: shouldRequestAddress
         ? error == null
            ? requestedAddress
            : storedGeolocation?.address
         : storedGeolocation?.address
   };
}

/**
 * Gets geolocation data, the permissions (Permissions.LOCATION) should be already granted, if the geolocation
 * is disabled for other reason (airplane mode or something like that) shows a error dialog requesting the user
 * to fix the problem by disabling airplane mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function getGeolocationPosition(
   settings?: GetGeolocationParams
): Promise<LocationCoords> {
   const {
      allowContinueWithGeolocationDisabled = false,
      errorDialogSettings = {},
      removePrecisionInCoordinates = true
   } = settings ?? {};

   let result: LocationCoords = null;

   try {
      /*
       * We only require the position in a city precision, not the exact location of the user, but
       * getCurrentPositionAsync({accuracy: Location.LocationAccuracy.Lowest}) the accuracy it's still
       * very high, so it's better for performance to use getLastKnownPositionAsync() when is available,
       * otherwise we use getCurrentPositionAsync().
       * Getting much lower accuracy "coarse location" like a city level precision seems to be not possible
       * so we "manually" remove digits to get that result, this is better to protect users' privacy.
       */
      let position = await Location.getLastKnownPositionAsync();
      if (position == null) {
         position = await Location.getCurrentPositionAsync({
            accuracy: Location.LocationAccuracy.Lowest
         });
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
      if (allowContinueWithGeolocationDisabled) {
         return Promise.resolve(null);
      }

      const retry = await showLocationDisabledDialog({
         ...errorDialogSettings,
         errorDetails: `${
            errorDialogSettings?.errorDetails ? errorDialogSettings?.errorDetails + " " : ""
         }getGeolocationPosition\n${tryToGetErrorMessage(error)}`
      });

      if (retry) {
         return getGeolocationPosition(settings);
      } else {
         throw new Error(error);
      }
   }
}

/**
 * Gets geolocation data, the permissions (Permissions.LOCATION) should be already granted, if the geolocation
 * is disabled for other reason (airplane mode or something like that) shows a error dialog requesting the user
 * to fix the problem by disabling airplane mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 * For some locations this function demonstrated to be not reliable, the app should be able to continue without
 * the information returned here.
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function getGeolocationAddress(
   coords: LocationCoords,
   settings?: GetGeolocationParams
): Promise<Location.LocationGeocodedAddress> {
   const { allowContinueWithGeolocationDisabled = false, errorDialogSettings = {} } =
      settings ?? {};

   try {
      let reverseGeocoding: Location.LocationGeocodedAddress[];

      try {
         // Sadly reverseGeocodeAsync() requires full accurate Location permissions on Android
         reverseGeocoding = await Location.reverseGeocodeAsync(coords);
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

      if (allowContinueWithGeolocationDisabled) {
         return Promise.resolve(null);
      }

      const retry = await showAddressDisabledDialog({
         ...errorDialogSettings,
         errorDetails: `${
            errorDialogSettings?.errorDetails ? errorDialogSettings?.errorDetails + " " : ""
         }getGeolocationAddress\n${tryToStringifyObject(coords)}\n${tryToGetErrorMessage(error)}`,
         cancelable: true // This is always cancellable since we should be able to continue without this info, an input where the user selects the country or city can be implemented.
      });

      if (retry) {
         return getGeolocationAddress(coords, settings);
      } else {
         throw new Error(error);
      }
   }
}

export interface GetGeolocationParams {
   /**
    * Disables the hook until this is true. Default = true (true and null = enabled)
    */
   enabled?: boolean;
   /**
    * Default = false. If false shows a dialog asking the user to enable geolocation and it does not allow the user to continue using the app until the geolocation is retrieved.
    */
   allowContinueWithGeolocationDisabled?: boolean;
   /**
    * Default = {}. Texts to show in the location not available error dialog, if this is not set then translated generic texts are used.
    */
   errorDialogSettings?: DisabledLocationDialogSettings;
   /**
    * Default = true. Removes latitude and longitude number precision to 2 decimal places in order to protect user privacy.
    */
   removePrecisionInCoordinates?: boolean;
}

export interface LocationData {
   coords: LocationCoords;
   address: Location.LocationGeocodedAddress;
}

export interface LocationCoords {
   latitude: number;
   longitude: number;
}

export interface UseGeolocation {
   isLoading: boolean;
   geolocation: {
      coords: LocationCoords;
      address?: Partial<Location.LocationGeocodedAddress>;
   };
}
