import { getGeolocationPosition } from "../../../../common-tools/device-native-api/geolocation/getGeolocationPosition";
import { sendUserProps, useUser } from "../../../../api/server/user";
import { useCache } from "../../../../api/tools/useCache/useCache";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { askGeolocationPermission } from "../../../../common-tools/device-native-api/geolocation/askGeolocationPermission";

/**
 * Gets geolocation and send it to the server if it's different to the current one.
 * Once this is done we can request new cards and the cards will be returned with
 * the new location.
 */
export function useUpdateGeolocationIfPossible() {
   const { data: user } = useUser();
   const { token } = useAuthentication();

   return useCache(
      "_geolocationPos_",
      async () => {
         const permissionGranted = await askGeolocationPermission({
            allowContinueWithoutAccepting: true,
            insistOnAcceptingOnce: true
         });

         if (!permissionGranted) {
            return { success: false };
         }

         const coords = await getGeolocationPosition({
            allowContinueWithGeolocationDisabled: true,
            backupCoords:
               user.locationLat != null && user.locationLon != null
                  ? { latitude: user.locationLat, longitude: user.locationLon }
                  : undefined
         });

         if (user.locationLat !== coords.latitude || user.locationLon !== user.locationLon) {
            await sendUserProps({
               token,
               props: { locationLat: coords.latitude, locationLon: coords.longitude },
               updateProfileCompletedProp: false
            });
         }

         return { success: true };
      },
      {
         enabled: user != null && token != null
      }
   );
}
