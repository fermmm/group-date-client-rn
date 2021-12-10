import { useEffect } from "react";
import { TaskType } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { useUser } from "../../../../api/server/user";
import { useNavigation } from "../../../../common-tools/navigation/useNavigation";

/**
 * When a required task is found in the user object this hook redirects to the page required.
 */
export function useRedirectWhenTaskFound() {
   const { data: user } = useUser();
   const { navigateWithoutHistory } = useNavigation();

   useEffect(() => {
      if (user == null) {
         return;
      }

      if (user.requiredTasks == null || user.requiredTasks.length === 0) {
         return;
      }

      if (user.requiredTasks[0].type === TaskType.ShowRemoveSeenMenu) {
         navigateWithoutHistory("RemoveSeenWizardPage", {
            groupId: user.requiredTasks[0].taskInfo
         });
      }
   }, [user]);
}
