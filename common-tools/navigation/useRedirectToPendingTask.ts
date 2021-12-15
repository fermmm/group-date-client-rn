import { TaskType } from "../../api/server/shared-tools/endpoints-interfaces/user";
import { useUser } from "../../api/server/user";
import { useNavigation } from "./useNavigation";

/**
 * When a required task is found in the user object this hook can be used to redirect to the page required.
 */
export function useRedirectToPendingTask(props?: { enabled?: boolean }) {
   const { enabled = true } = props ?? {};
   const { data: user, isLoading } = useUser({ config: { enabled } });
   const { navigateWithoutHistory } = useNavigation();

   const redirect = () => {
      if (!enabled || isLoading) {
         return;
      }

      if (user?.requiredTasks?.[0]?.type === TaskType.ShowRemoveSeenMenu) {
         navigateWithoutHistory("RemoveSeenWizardPage", {
            groupId: user.requiredTasks[0].taskInfo
         });
      }
   };

   return {
      isLoading,
      shouldRedirect: user?.requiredTasks?.length > 0,
      redirect
   };
}
