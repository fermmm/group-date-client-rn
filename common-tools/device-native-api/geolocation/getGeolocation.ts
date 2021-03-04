import { useLocalStorage } from "./../storage/useLocalStorage";
import { useCache } from "./../../../api/tools/useCache";
import * as Location from "expo-location";
import {
   showLocationDisabledDialog,
   DisabledLocationDialogSettings
} from "./dialogLocationDisabled/dialogLocationDisabled";
import * as Permissions from "expo-permissions";
import { usePermission } from "../permissions/askForPermissions";

/**
 * Gets geolocation data, asks for permissions Permissions.LOCATION. If the geolocation
 * is disabled for a reason other than the permissions (airplane mode or something like that
 * then it shows a error dialog requesting the user to fix the problem by disabling airplane
 * mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export function useGeolocation(settings?: GetGeolocationParams) {
   const permissionGranted = usePermission(Permissions.LOCATION);
   const {
      value: storedGeolocation,
      setValue: setStoredGeolocation,
      isLoading: localStorageLoading
   } = useLocalStorage<LocationData>("__geolocation__");

   const enabled = settings?.enabled !== false && permissionGranted && !localStorageLoading;

   const { data: geolocation, isLoading, error } = useCache(
      "_geolocation_",
      () =>
         getGeolocation({
            ...settings,
            errorDialogSettings: { cancelable: storedGeolocation != null }
         }),
      { enabled, onSuccess: geo => setStoredGeolocation(geo) }
   );

   if (!enabled) {
      return { isLoading: true, geolocation: null };
   }

   // TODO: This error handling and local storage usage is not yet working correctly
   // console.log(isLoading, error);

   return { isLoading, geolocation: geolocation ?? storedGeolocation };
}

/**
 * Gets geolocation data, the permissions (Permissions.LOCATION) should be already granted, if the geolocation
 * is disabled for other reason (airplane mode or something like that) shows a error dialog requesting the user
 * to fix the problem by disabling airplane mode or checking what's wrong.
 * To change dialog texts use the settings parameter.
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function getGeolocation(settings?: GetGeolocationParams): Promise<LocationData> {
   if (settings == null) {
      settings = {};
   }

   settings.allowContinueWithGeolocationDisabled =
      settings.allowContinueWithGeolocationDisabled || false;
   settings.errorDialogSettings = settings.errorDialogSettings || {};

   let locationData: LocationData = null;

   try {
      const position = await Location.getLastKnownPositionAsync();
      const reverseGeocoding = await Location.reverseGeocodeAsync(position.coords);
      let info: Location.LocationGeocodedAddress = null;
      if (reverseGeocoding != null && reverseGeocoding.length > 0) {
         info = reverseGeocoding[0];
      }

      locationData = {
         coords: position.coords,
         info
      };

      return Promise.resolve(locationData);
   } catch (error) {
      if (settings.allowContinueWithGeolocationDisabled) {
         return Promise.resolve(null);
      }
      const retry = await showLocationDisabledDialog(settings.errorDialogSettings);
      if (retry) {
         return getGeolocation(settings);
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
    * Default = false. If false shows a dialog asking the user to enable geolocation.
    */
   allowContinueWithGeolocationDisabled?: boolean;
   /**
    * Default = {}. Texts to show in the location not available error dialog, if this is not set then english generic texts are used.
    */
   errorDialogSettings?: DisabledLocationDialogSettings;
}

export interface LocationData {
   coords: { latitude: number; longitude: number };
   info: Location.LocationGeocodedAddress;
}
