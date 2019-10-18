import * as Location from "expo-location";
import { showLocationDisabledDialog, DisabledLocationDialogTexts } from "./dialogLocationDisabled/dialogLocationDisabled";

/**
 * Gets geolocation data, the permissions should be already granted, if the geolocation is disabled shows a
 * error dialog requesting the activation. 
 * To change dialog texts use the settings parameter.  
 * @param settings Use this parameter to disable dialogs or change dialogs texts.
 */
export async function getGeolocation(settings: GetGeolocationParams = {}): Promise<Location.LocationData> {
   settings.allowContinueWithGeolocationDisabled = settings.allowContinueWithGeolocationDisabled || false;
   settings.disabledLocationDialogTexts = settings.disabledLocationDialogTexts || {};

   let locationData: Location.LocationData = null;

   try {
      locationData = await Location.getCurrentPositionAsync({});
   } catch (error) {
      if (settings.allowContinueWithGeolocationDisabled) {
         return Promise.resolve(null);
      }
      await showLocationDisabledDialog(settings.disabledLocationDialogTexts);
      return getGeolocation(settings);
   }

   return Promise.resolve(locationData);
}

export interface GetGeolocationParams {
   /**
    * Default = false. If false shows a dialog asking the user to enable geolocation.
    */
   allowContinueWithGeolocationDisabled?: boolean;
   /**
    * Default = {}. Texts to show in the location not avaiable error dialog, if this is not set then english generic texts are used. 
    */
   disabledLocationDialogTexts?: DisabledLocationDialogTexts;
}