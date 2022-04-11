import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { sendUserProps } from "../../../../api/server/user";
import { getGeolocationAddress } from "../../../../common-tools/device-native-api/geolocation/getGeolocationAddress";
import { LocationCoords } from "../../../../common-tools/device-native-api/geolocation/typings";

/**
 * Gets the address and updates it in the server if it's different to the current one.
 * It required the coordinates and geolocation permissions.
 */
export async function tryToUpdateAddress(props: {
   token: string;
   user: User;
   coords: LocationCoords;
   permissionGranted: boolean;
}) {
   const { token, user, coords, permissionGranted } = props;

   if (
      coords.latitude == null ||
      coords.longitude == null ||
      !permissionGranted ||
      user == null ||
      token == null
   ) {
      return null;
   }

   const address = await getGeolocationAddress(coords, {
      showError: false
   });

   if (address?.isoCountryCode != null && address?.isoCountryCode != user?.country) {
      await sendUserProps({
         token,
         props: { country: address.isoCountryCode },
         updateProfileCompletedProp: false
      });
   }
}
