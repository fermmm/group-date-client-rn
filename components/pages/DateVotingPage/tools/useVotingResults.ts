import { getGroupMember } from "./../../../../api/tools/groupTools";
import { Group } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";
import { dayAndMonthFromUnixDate } from "../../../../common-tools/dates/dates-tools";

export function useVotingResultToRender(
   group: Group,
   results: Pick<Group, "mostVotedDate" | "mostVotedIdea">
): UseVotingResults {
   if (group == null) {
      return null;
   }

   return {
      day: results?.mostVotedDate != null ? dayAndMonthFromUnixDate(results.mostVotedDate) : null,
      idea:
         results?.mostVotedIdea != null
            ? getGroupMember(results.mostVotedIdea, group)?.dateIdea
            : null
   };
}

export interface UseVotingResults {
   day?: string;
   idea?: string;
}
