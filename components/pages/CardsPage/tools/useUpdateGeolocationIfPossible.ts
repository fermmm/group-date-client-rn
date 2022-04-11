import { useUser } from "../../../../api/server/user";
import { useCache } from "../../../../api/tools/useCache/useCache";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { sendLocationDataToServer } from "./sendLocationDataToServer";

/**
 * The user may travel to a different location, this solves the issue by getting
 * the geolocation position and send it to the server if it's different to the current one.
 * New cards should be requested once this success or fails, if this function fails to
 * get the position it does not matter it should use the current one on the server.
 */
export function useUpdateGeolocationIfPossible() {
   const { data: user } = useUser();
   const { token } = useAuthentication();

   return useCache(
      "_geolocationPos_",
      async () =>
         await sendLocationDataToServer({
            token,
            user,
            settings: {
               errorMessageCancellable: true,
               backupCoords:
                  user.locationLat != null && user.locationLon != null
                     ? { latitude: user.locationLat, longitude: user.locationLon }
                     : undefined
            }
         }),
      {
         enabled:
            token != null && // Token is required to send the user props
            user != null &&
            user?.locationLat != null && // If there is no location in server another code will be requesting the location and not this one, this one is meant only to update it.
            user?.locationLon != null
      }
   );
}
