import { getGroupMember } from "./../../../../api/tools/groupTools";
import { firstBy } from "thenby";
import { Group } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";
import { dayAndMonthFromUnixDate } from "../../../../common-tools/dates/dates-tools";

export function useVotingResults(group: Group): UseVotingResults {
   if (group == null) {
      return null;
   }

   return {
      day: dayAndMonthFromUnixDate(
         group.dayOptions
            .filter(op => op.votersUserId?.length > 0)
            .sort(firstBy(op => op.votersUserId?.length ?? 0, "desc"))?.[0]?.date
      ),
      idea: getGroupMember(
         group.dateIdeasVotes
            .filter(op => op.votersUserId?.length > 0)
            .sort(firstBy(op => op.votersUserId?.length ?? 0, "desc"))?.[0]?.ideaOfUser,
         group
      )?.dateIdea
   };
}

export interface UseVotingResults {
   day?: string;
   idea?: string;
}
