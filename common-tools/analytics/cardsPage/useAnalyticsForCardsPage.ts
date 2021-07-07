import { useEffect } from "react";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { analyticsLogEvent } from "../tools/analyticsLog";

let alreadySent = false;
export function useAnalyticsForCardsPage(users: User[]) {
   useEffect(() => {
      if (alreadySent) {
         return;
      }

      if (users?.length > 0) {
         analyticsLogEvent("a_user_to_like_or_dislike_appears");
         alreadySent = true;
      }
   }, [users]);
}
