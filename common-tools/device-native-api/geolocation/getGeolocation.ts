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
import { Platform } from "react-native";
import { useUserProfileStatus } from "../../../api/server/user";

/**
 * Gets geolocation data, asks for permissions Permissions.LOCATION. If the geolocation
 * is disabled for a reason other than the permissions (airplane mode or something like that)
 * then it shows a error dialog requesting the user to fix the problem by disabling airplane
 * mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 *
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function useGeolocation(settings?: GetGeolocationParams): UseGeolocation {
   const allowContinueWithGeolocationDisabled =
      Platform.OS === "ios" ? true : settings?.allowContinueWithGeolocationDisabled ?? false;

   const permissionGranted = usePermission(
      {
         getter: () => Location.getForegroundPermissionsAsync(),
         requester: () => Location.requestForegroundPermissionsAsync()
      },
      {
         enabled: settings?.enabled ?? true,
         allowContinueWithoutAccepting: allowContinueWithGeolocationDisabled,
         insistOnAcceptingOnce: true,
         permissionName: i18n.t("location")
      }
   );

   const { data: profileStatusData } = useUserProfileStatus();

   const { coords, isLoading: coordsLoading } = useGeolocationCoords({
      enabled: permissionGranted != null && profileStatusData != null,
      settings: {
         ...settings,
         permissionGranted,
         allowContinueWithGeolocationDisabled,
         backupCoords:
            profileStatusData?.user?.locationLat != null &&
            profileStatusData?.user?.locationLon != null
               ? {
                    latitude: profileStatusData.user.locationLat,
                    longitude: profileStatusData.user.locationLon
                 }
               : undefined
      }
   });

   const { address, isLoading: addressIsLoading } = useAddress({
      permissionGranted,
      coords,
      settings: { ...settings, allowContinueWithGeolocationDisabled }
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
 * This just converts getGeolocationPosition() into a hook and caches the result.
 */
function useGeolocationCoords(params: { settings: GetGeolocationParams; enabled?: boolean }) {
   const { settings, enabled = true } = params;

   const { data: coords, isLoading } = useCache(
      "_geolocationPos_",
      () => getGeolocationPosition(settings),
      { enabled }
   );

   return { isLoading, coords };
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
      removePrecisionInCoordinates = true,
      permissionGranted,
      backupCoords
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

      let retry: boolean = false;

      // If permissions are granted then we have an error to show to the user, otherwise we know what is happening, no error dialog needed.
      if (permissionGranted) {
         retry = await showLocationDisabledDialog({
            ...errorDialogSettings,
            cancelable: allowContinueWithGeolocationDisabled,
            errorDetails: `${
               errorDialogSettings?.errorDetails ? errorDialogSettings?.errorDetails + " " : ""
            }getGeolocationPosition\n${tryToGetErrorMessage(error)}`
         });
      }

      if (retry) {
         return getGeolocationPosition(settings);
      } else {
         if (allowContinueWithGeolocationDisabled) {
            return Promise.resolve(backupCoords ?? { latitude: 2.0, longitude: -157.39 });
         } else {
            throw new Error(error);
         }
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
   const {
      allowContinueWithGeolocationDisabled = false,
      errorDialogSettings = {},
      permissionGranted
   } = settings ?? {};

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

      if (permissionGranted === false && allowContinueWithGeolocationDisabled) {
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
   /**
    * If the user does not prive location permission then cords on this prop will be used, if not provided in this prop then an island in the middle of nowhere will be the location.
    */
   backupCoords?: LocationCoords;
   /**
    * The result of requesting location permissions.
    */
   permissionGranted?: boolean;
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
