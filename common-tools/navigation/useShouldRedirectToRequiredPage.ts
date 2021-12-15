import { useUserProfileStatus } from "../../api/server/user";
import { userHasFinishedRegistration } from "../../api/tools/userTools";
import { usePushNotificationPressRedirect } from "../device-native-api/notifications/usePushNotificationPressRedirect";
import { useNavigation } from "./useNavigation";
import { useRedirectToPendingTask } from "./useRedirectToPendingTask";

/**
 * This function provides boolean to know if the user should be redirected to a screen that is not
 * "Main" after login. Also provides a function that redirects to the required page if needed.
 * The user may be required to be redirected because he has not finished registration, clicked on
 * a notification or has pending tasks.
 */
export function useShouldRedirectToRequiredPage(props?: { enabled?: boolean }) {
   const { enabled = true } = props ?? {};
   const { navigateWithoutHistory } = useNavigation();
   const { data: profileStatusData, isLoading: profileStatusLoading } = useUserProfileStatus({
      config: { enabled }
   });
   const finishedRegistration = userHasFinishedRegistration(profileStatusData);

   const {
      isLoading: pendingTaskLoading,
      shouldRedirect: shouldRedirectToPendingTask,
      redirect: redirectToPendingTask
   } = useRedirectToPendingTask({ enabled });

   const {
      redirectFromPushNotificationPress,
      isLoading: notificationPressLoading,
      shouldRedirect: shouldRedirectBecauseNotificationPress
   } = usePushNotificationPressRedirect();

   const isLoading = pendingTaskLoading || notificationPressLoading || profileStatusLoading;
   const shouldRedirect =
      shouldRedirectToPendingTask ||
      shouldRedirectBecauseNotificationPress ||
      !finishedRegistration;

   const redirect = () => {
      if (isLoading || !shouldRedirect) {
         return;
      }

      if (!finishedRegistration) {
         navigateWithoutHistory("RegistrationForms");
         return;
      }

      if (shouldRedirectToPendingTask) {
         redirectToPendingTask();
         return;
      }

      if (shouldRedirectBecauseNotificationPress) {
         redirectFromPushNotificationPress();
         return;
      }
   };

   return {
      shouldRedirectIsLoading: isLoading,
      shouldRedirectToRequiredPage: shouldRedirect,
      redirectToRequiredPage: redirect
   };
}
