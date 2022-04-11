import { getGeolocationPosition } from "../../../../common-tools/device-native-api/geolocation/getGeolocationPosition";
import { sendUserProps } from "../../../../api/server/user";
import { askGeolocationPermission } from "../../../../common-tools/device-native-api/geolocation/askGeolocationPermission";
import { tryToUpdateAddress } from "./tryToUpdateAddress";
import { GetGeolocationParams } from "../../../../common-tools/device-native-api/geolocation/typings";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";

export async function sendLocationDataToServer(props: {
   token: string;
   user: User;
   settings?: GetGeolocationParams;
}) {
   const { token, user, settings } = props;

   const permissionGranted = await askGeolocationPermission({
      allowContinueWithoutAccepting: true,
      insistOnAcceptingOnce: true
   });

   if (!permissionGranted) {
      return { success: false };
   }

   const coords = await getGeolocationPosition(settings);

   if (user.locationLat !== coords.latitude || user.locationLon !== user.locationLon) {
      await sendUserProps({
         token,
         props: { locationLat: coords.latitude, locationLon: coords.longitude },
         updateProfileCompletedProp: false
      });
   }

   // We don't await for this promise because we don't need and it would contribute to slow down the cards loading.
   tryToUpdateAddress({ token, user, coords, permissionGranted });

   return { success: true };
}
