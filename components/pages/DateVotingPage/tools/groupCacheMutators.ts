import { Group } from "../../../../api/server/shared-tools/endpoints-interfaces/groups";
import { VoteChange } from "../../../common/VotingPoll/VotingPoll";
import { mutateCache } from "../../../../api/tools/useCache";

export function mutateGroupCacheDayVote(specificChange: VoteChange, userId: string, group: Group) {
   const dayOptions = [...group.dayOptions];
   const optionWithVoteChange = dayOptions.find(op => op.date === specificChange.id);

   if (specificChange.removed) {
      optionWithVoteChange.votersUserId.splice(
         optionWithVoteChange.votersUserId.indexOf(userId),
         1
      );
   } else {
      if (optionWithVoteChange.votersUserId == null) {
         optionWithVoteChange.votersUserId = [userId];
      } else {
         optionWithVoteChange.votersUserId.push(userId);
      }
   }

   mutateCache<Group>("group" + group.groupId, { ...group, dayOptions });
}

export function mutateGroupCacheIdeaVote(specificChange: VoteChange, userId: string, group: Group) {
   const dateIdeasVotes = [...group.dateIdeasVotes];
   const optionWithVoteChange = dateIdeasVotes.find(op => op.ideaOfUser === specificChange.id);

   if (specificChange.removed) {
      optionWithVoteChange?.votersUserId.splice(
         optionWithVoteChange?.votersUserId.indexOf(userId),
         1
      );
   } else {
      if (optionWithVoteChange == null) {
         dateIdeasVotes.push({
            ideaOfUser: specificChange.id as string,
            votersUserId: [userId]
         });
      } else {
         if (optionWithVoteChange.votersUserId == null) {
            optionWithVoteChange.votersUserId = [userId];
         } else {
            optionWithVoteChange.votersUserId.push(userId);
         }
      }
   }

   mutateCache<Group>("group" + group.groupId, { ...group, dateIdeasVotes });
}
