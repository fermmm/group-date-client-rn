import { useGeolocation } from "../../../../common-tools/device-native-api/geolocation/useGeolocation";
import { useEffect, useState } from "react";
import { getExpoPushToken } from "../../../../common-tools/device-native-api/notifications/getPermissionTokenForNotifications";
import { sendUserProps, useUserProfileStatus } from "../../../../api/server/user";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { useNotificationPermission } from "../../../../common-tools/device-native-api/notifications/useNotificationsPermissions";

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
   const { enabled = true } = settings ?? {};
   const [completed, setCompleted] = useState<boolean>(false);
   const [expoPushToken, setExpoPushToken] = useState<string>();
   const [notificationsPossible, setNotificationsPossible] = useState<boolean>();
   const [notificationTokenRequested, setNotificationTokenRequested] = useState(false);
   const [locationLat, setLocationLat] = useState<number>();
   const [locationLon, setLocationLon] = useState<number>();
   const [country, setCountry] = useState<string>();
   const { data: profileStatusData } = useUserProfileStatus();
   const { geolocation, isLoading: geolocationLoading } = useGeolocation({ enabled });
   const notificationPermissionGranted = useNotificationPermission({ enabled });

   // Effect to set the geolocation state when geolocation is ready
   useEffect(() => {
      if (geolocationLoading) {
         return;
      }

      if (geolocation?.coords?.latitude != null && geolocation?.coords?.longitude != null) {
         setLocationLat(geolocation.coords.latitude);
         setLocationLon(geolocation.coords.longitude);
         setCountry(
            geolocation.address?.isoCountryCode ?? profileStatusData?.user?.country ?? "UNKNOWN"
         );
      }
   }, [geolocation, geolocationLoading]);

   // Effect to set notification state when is ready
   useEffect(() => {
      if (
         serverInfo?.pushNotificationsChannels == null ||
         notificationTokenRequested ||
         enabled === false ||
         notificationPermissionGranted == null
      ) {
         return;
      }

      if (notificationPermissionGranted === false) {
         setNotificationsPossible(false);
         return;
      }

      setNotificationTokenRequested(true);
      (async () => {
         const notificationsTokenResponse = await getExpoPushToken(
            serverInfo.pushNotificationsChannels
         );
         setExpoPushToken(notificationsTokenResponse.notificationsToken);
         setNotificationsPossible(notificationsTokenResponse.notificationsArePossible);
      })();
   }, [
      serverInfo?.pushNotificationsChannels,
      enabled,
      notificationTokenRequested,
      notificationPermissionGranted
   ]);

   // Effect to send the data to the server when all the information is gathered
   useEffect(() => {
      if (
         locationLat != null &&
         locationLon != null &&
         country != null &&
         (expoPushToken != null || notificationsPossible === false) &&
         token != null &&
         enabled === true &&
         completed === false
      ) {
         let props: Partial<User> = {
            locationLat,
            locationLon,
            country
         };

         if (notificationsPossible) {
            props.notificationsToken = expoPushToken;
         }

         (async () => {
            await sendUserProps({ token, props }, false);
            setCompleted(true);
         })();
      }
   }, [
      expoPushToken,
      locationLat,
      locationLon,
      country,
      token,
      enabled,
      completed,
      notificationsPossible
   ]);

   return completed;
}
