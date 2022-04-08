import * as Location from "expo-location";
import { DisabledLocationDialogSettings } from "./dialogLocationDisabled/dialogLocationDisabled";

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
    * If the user does not provide location permission or there is any problem getting the coords then cords on this prop will be used, if not provided in this prop then an island in the middle of nowhere will be the location.
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
   };
}
