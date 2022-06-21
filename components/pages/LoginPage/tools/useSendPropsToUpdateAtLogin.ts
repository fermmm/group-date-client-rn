import { useEffect, useState } from "react";
import { getExpoPushToken } from "../../../../common-tools/device-native-api/notifications/getPermissionTokenForNotifications";
import { sendUserProps } from "../../../../api/server/user";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { useNotificationPermission } from "../../../../common-tools/device-native-api/notifications/useNotificationsPermissions";

/**
 * At every login there are some user props that need to be updated: The user may be in a different
 * location, this hook collects all this information and sends it to the server. It's meant to be called
 * at login. Currently only the notification toquen makes sense to keep it here.
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
   const notificationPermissionGranted = useNotificationPermission({ enabled });

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
         setExpoPushToken(notificationsTokenResponse?.notificationsToken);
         setNotificationsPossible(Boolean(notificationsTokenResponse?.notificationsArePossible));
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
         (expoPushToken != null || notificationsPossible === false) &&
         token != null &&
         enabled === true &&
         completed === false
      ) {
         let props: Partial<User> = {};

         if (notificationsPossible) {
            props.notificationsToken = expoPushToken;
         }

         (async () => {
            await sendUserProps({ token, props }, false);
            setCompleted(true);
         })();
      }
   }, [expoPushToken, token, enabled, completed, notificationsPossible]);

   return completed;
}
