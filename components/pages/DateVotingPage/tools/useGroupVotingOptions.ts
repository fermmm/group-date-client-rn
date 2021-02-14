import { firstBy } from "thenby";
import { Group } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";
import { dayAndMonthFromUnixDate } from "../../../../common-tools/dates/dates-tools";
import { VotingOption } from "../../../common/VotingPoll/VotingPoll";

export function useGroupVotingOptions(group: Group): UseGroupVotingOptions {
   if (group == null) {
      return null;
   }

   return {
      dayOptions: group.dayOptions.map(op => ({
         name: dayAndMonthFromUnixDate(op.date),
         id: op.date,
         voters: op.votersUserId
      })),

      ideaOptions: group.members
         .map(member => ({
            name: member.dateIdea,
            id: member.userId,
            voters: group.dateIdeasVotes?.find(i => i.ideaOfUser === member.userId)?.votersUserId
         }))
         .sort(firstBy(op => op.voters?.length ?? 0, "desc"))
   };
}

export interface UseGroupVotingOptions {
   ideaOptions: VotingOption[];
   dayOptions: VotingOption[];
}
