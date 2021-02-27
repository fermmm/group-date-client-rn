import { useGeolocation } from "./../../../../common-tools/device-native-api/geolocation/getGeolocation";
import { useEffect, useState } from "react";
import { getPermissionTokenForNotifications } from "../../../../common-tools/device-native-api/notifications/getPermissionTokenForNotifications";
import { sendUserProps } from "../../../../api/server/user";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";

/**
 * At every login there are some user props that need to be updated: The user may be in a different
 * location, the notifications token may be different and other user props may need to be updated at
 * login, this hook collects all this information and sends it to the server. It's meant to be called
 * at login.
 */
export function useSendPropsToUpdateAtLogin(
   token: string,
   serverInfo: ServerInfoResponse,
   settings: { enabled: boolean }
): boolean {
   const [completed, setCompleted] = useState<boolean>(false);
   const { geolocation } = useGeolocation();
   const [notificationsToken, setNotificationsToken] = useState<string>();
   const [locationLat, setLocationLat] = useState<number>();
   const [locationLon, setLocationLon] = useState<number>();
   const [country, setCountry] = useState<string>();

   // Effect to set the geolocation state when geolocation is ready
   useEffect(() => {
      if (
         geolocation?.coords?.latitude != null &&
         geolocation?.coords?.longitude != null &&
         geolocation?.info?.isoCountryCode != null
      ) {
         setLocationLat(geolocation.coords.latitude);
         setLocationLon(geolocation.coords.longitude);
         setCountry(geolocation.info.isoCountryCode);
      }
   }, [geolocation]);

   // Effect to set notification state when is ready
   useEffect(() => {
      if (serverInfo?.pushNotificationsChannels == null) {
         return;
      }

      (async () => {
         setNotificationsToken(
            await getPermissionTokenForNotifications(serverInfo.pushNotificationsChannels)
         );
      })();
   }, [serverInfo?.pushNotificationsChannels]);

   // Effect to send the data to the server when all the information is gathered
   useEffect(() => {
      if (
         notificationsToken != null &&
         locationLat != null &&
         locationLon != null &&
         country != null &&
         token != null &&
         settings.enabled
      ) {
         (async () => {
            await sendUserProps(
               { token, props: { locationLat, locationLon, country, notificationsToken } },
               false
            );
            setCompleted(true);
         })();
      }
   }, [notificationsToken, locationLat, locationLon, country, token, settings.enabled]);

   return completed;
}
