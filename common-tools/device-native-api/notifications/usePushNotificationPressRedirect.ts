import { UsePushNotificationPress, usePushNotificationPress } from "./usePushNotificationPress";
import { useNavigation } from "./../../navigation/useNavigation";

/**
 * This hook may return a function redirectFromPushNotificationPress, if the function is not null it means the
 * user pressed on a push notification and the app should redirect to corresponding page which is what the
 * function does, after calling it becomes null.
 */
export function usePushNotificationPressRedirect(): UsePushNotificationPress {
   const { navigateWithoutHistory } = useNavigation();

   return usePushNotificationPress({
      redirect: (route, params) => {
         navigateWithoutHistory(route, params);
      }
   });
}
