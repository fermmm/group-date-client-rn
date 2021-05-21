import { Gender } from "../../../../../api/server/shared-tools/endpoints-interfaces/user";
import { GenderSelection } from "../../../../../api/server/shared-tools/user-tools/getUserGenderSelection";
import { TagsToUpdate } from "../../RegistrationFormsPage";

export function getGenderTagsToUpdate(props: {
   gendersSelected: Gender[];
   initialGenderSelection: GenderSelection;
   genderTargetMode: boolean;
}): TagsToUpdate {
   const { gendersSelected, initialGenderSelection, genderTargetMode } = props;

   if (genderTargetMode) {
      return {
         // Selected genders that were blocked before should be added to the unblock list
         tagsToUnblock:
            gendersSelected?.filter(gender => initialGenderSelection?.blocked?.includes(gender)) ??
            [],

         // All genders that were not selected and were not blocked before should be added to the block list
         // For example of the user don't like Woman, the woman tag should be blocked
         tagsToBlock:
            Object.values(Gender).filter(
               gender =>
                  (gendersSelected?.includes(gender) ?? false) === false &&
                  (initialGenderSelection?.blocked?.includes(gender) ?? false) === false
            ) ?? []
      };
   } else {
      return {
         // Genders selected that were not selected initially should be added to the subscription
         tagsToSubscribe:
            gendersSelected?.filter(
               gender => (initialGenderSelection?.subscribed?.includes(gender) ?? false) === false
            ) ?? [],

         // Initially selected genders that are not selected anymore should be unsubscribed
         tagsToUnsubscribe:
            initialGenderSelection?.subscribed?.filter(
               gender => (gendersSelected?.includes(gender) ?? false) === false
            ) ?? []
      };
   }
}
