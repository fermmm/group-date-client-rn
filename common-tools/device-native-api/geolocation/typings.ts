import * as Location from "expo-location";
import { DisabledLocationDialogSettings } from "./dialogLocationDisabled/dialogLocationDisabled";

export interface GetGeolocationParams {
   /**
    * Disables the hook until this is true. Default = true (true and null = enabled)
    */
   enabled?: boolean;
   /**
    * Default = false. When trying to retrieve geolocation and an error occurs (not related with permission) a dialog is showed to the user indicating that there may be a setting that disabled access to location, this
    * setting controls if the dialog is cancelable or not. Use backupCoords to make this function return the last coords or fake ones in case the dialog is canceled.
    */
   errorMessageCancellable?: boolean;
   /**
    * Default = {}. Texts to show in the location not available error dialog, if this is not set then translated generic texts are used.
    */
   errorDialogSettings?: DisabledLocationDialogSettings;
   /**
    * Default = true. Removes latitude and longitude number precision to 2 decimal places in order to protect user privacy.
    */
   removePrecisionInCoordinates?: boolean;
   /**
    * If the user does not provide location permission or there is any problem getting the coords then the coords on this prop will be used, if not provided in this prop then an island in the middle of nowhere will be the location.
    * To disable this feature use enableBackupCoords prop.
    */
   backupCoords?: LocationCoords;
   /**
    * Default = true. If there is any problem getting the information show an error.
    */
   showError?: boolean;
   /**
    * Default = true. If this is false when coordinates cannot be retrieved the promise resolves to error without the coordinates. If this is true it will return the backupCoords or any coords, also allowContinueWithGeolocationDisabled needs to be true.
    */
   enableBackupCoords?: boolean;
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
