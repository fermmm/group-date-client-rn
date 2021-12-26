import { useEffect } from "react";
import { Alert } from "react-native";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { sendSeenToGroup, useUserGroupList } from "../../../../api/server/groups";
import { useUser } from "../../../../api/server/user";
import { analyticsLogEvent } from "../../../../common-tools/analytics/tools/analyticsLog";

/**
 * Checks that the group seen endpoint should be called and calls it if needed.
 * Also shows an alert notification if the group is not seen by the user.
 */
export function useGroupSeenChecker() {
   const { data: groups } = useUserGroupList();
   const { data: user } = useUser();
   const { token } = useAuthentication(user?.token);

   useEffect(() => {
      if (groups == null || user == null || token == null) {
         return;
      }

      const notSeenGroup = groups.find(group => !group.seenBy.includes(user.userId));

      if (notSeenGroup != null) {
         Alert.alert(
            "Estas en un grupo",
            "¡¡Se formó un grupo y estás en el!!. Ve a la sección de grupos para verlo."
         );
         sendSeenToGroup({ token, userId: user.userId, groupId: notSeenGroup.groupId });
         analyticsLogEvent("user_has_new_group", {
            groupMembersAmount: notSeenGroup.membersAmount
         });
      }
   }, [groups, user, token]);
}
