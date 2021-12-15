import { UsePushNotificationPress, usePushNotificationPress } from "./usePushNotificationPress";
import { useNavigation } from "./../../navigation/useNavigation";

/**
 * If the user pressed a notification, this function will update the notification as seen and provide a function
 * and booleans to redirect and know when to redirect.
 */
export function usePushNotificationPressRedirect(): UsePushNotificationPress {
   const { navigateWithoutHistory } = useNavigation();

   return usePushNotificationPress({
      redirect: (route, params) => {
         navigateWithoutHistory(route, params);
      }
   });
}
