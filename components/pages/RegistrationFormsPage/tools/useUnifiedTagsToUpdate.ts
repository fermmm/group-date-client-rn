import { TagsToUpdate } from "../RegistrationFormsPage";

/**
 * Unifies the lists of tags to update of all forms into a single object
 * @param formsWithTagChanges Form name with the tags to update
 */
export function getUnifiedTagsToUpdate(
   formsWithTagChanges: Record<string, TagsToUpdate>
): TagsToUpdate | null {
   if (formsWithTagChanges == null || Object.keys(formsWithTagChanges).length === 0) {
      return null;
   }

   let unifiedTagsToUpdate: TagsToUpdate = {
      tagsToUnsubscribe: [],
      tagsToSubscribe: [],
      tagsToBlock: [],
      tagsToUnblock: []
   };

   Object.keys(formsWithTagChanges).forEach(form => {
      const formTagChanges = formsWithTagChanges[form];

      unifiedTagsToUpdate = {
         tagsToUnsubscribe: [
            ...unifiedTagsToUpdate.tagsToUnsubscribe,
            ...(formTagChanges?.tagsToUnsubscribe ?? [])
         ],
         tagsToSubscribe: [
            ...unifiedTagsToUpdate.tagsToSubscribe,
            ...(formTagChanges?.tagsToSubscribe ?? [])
         ],
         tagsToBlock: [...unifiedTagsToUpdate.tagsToBlock, ...(formTagChanges?.tagsToBlock ?? [])],
         tagsToUnblock: [
            ...unifiedTagsToUpdate.tagsToUnblock,
            ...(formTagChanges?.tagsToUnblock ?? [])
         ]
      };
   });

   return unifiedTagsToUpdate;
}
