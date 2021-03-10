import { TagsToUpdate } from "../RegistrationFormsPage";

export function useUnifiedTagsToUpdate(
   questionIdsWithTags: Record<string, TagsToUpdate>
): UseUnifiedTagsToUpdate | null {
   if (questionIdsWithTags == null || Object.keys(questionIdsWithTags).length === 0) {
      return { unifiedTagsToUpdate: null, questionsShowed: null };
   }

   let unifiedTagsToUpdate: TagsToUpdate = {
      tagsToUnsubscribe: [],
      tagsToSubscribe: [],
      tagsToBlock: [],
      tagsToUnblock: []
   };

   let questionsShowed: string[] = [];

   Object.keys(questionIdsWithTags).forEach(questionId => {
      const tags = questionIdsWithTags[questionId];

      questionsShowed = [...questionsShowed, questionId];
      unifiedTagsToUpdate = {
         tagsToUnsubscribe: [...unifiedTagsToUpdate.tagsToUnsubscribe, ...tags.tagsToUnsubscribe],
         tagsToSubscribe: [...unifiedTagsToUpdate.tagsToSubscribe, ...tags.tagsToSubscribe],
         tagsToBlock: [...unifiedTagsToUpdate.tagsToBlock, ...tags.tagsToBlock],
         tagsToUnblock: [...unifiedTagsToUpdate.tagsToUnblock, ...tags.tagsToUnblock]
      };
   });

   return { unifiedTagsToUpdate, questionsShowed };
}

export interface UseUnifiedTagsToUpdate {
   unifiedTagsToUpdate: TagsToUpdate;
   questionsShowed?: string[];
}
