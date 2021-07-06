import I18n from "i18n-js";
import {
   ALL_GENDERS,
   CIS_GENDERS
} from "./../../api/server/shared-tools/endpoints-interfaces/user";
import { TagBasicInfo } from "./../../api/server/shared-tools/endpoints-interfaces/tags";
import { Gender } from "../../api/server/shared-tools/endpoints-interfaces/user";

export function getGenderName(
   userTagsSubscribed: TagBasicInfo[],
   isCoupleProfile: boolean,
   translate: boolean = true
): string {
   if (isCoupleProfile) {
      return "Pareja";
   }
   const genderTags = userTagsSubscribed.filter(tag => ALL_GENDERS.includes(tag.tagId as Gender));
   if (translate) {
      return genderTags.map(tag => I18n.t(tag.name)).join(", ");
   } else {
      return genderTags.map(tag => tag.name).join(", ");
   }
}

export function getCisGenderName(
   userTagsSubscribed: TagBasicInfo[],
   translate: boolean = true
): string {
   const genderTags = userTagsSubscribed.filter(tag => CIS_GENDERS.includes(tag.tagId as Gender));
   if (translate) {
      return genderTags.map(tag => I18n.t(tag.name)).join(", ");
   } else {
      return genderTags.map(tag => tag.name).join(", ");
   }
}

export function getGendersUserIsAttractedTo(
   userTagsBlocked: TagBasicInfo[],
   translate: boolean = true
): string {
   const genders = ALL_GENDERS.filter(
      gender => userTagsBlocked.find(tag => tag.tagId === gender) == null
   );
   if (translate) {
      return genders.map(gender => I18n.t(gender)).join(", ");
   } else {
      return genders.join(", ");
   }
}

export function getCisGendersUserIsAttractedTo(
   userTagsBlocked: TagBasicInfo[],
   translate: boolean = true
): string {
   const genders = CIS_GENDERS.filter(
      gender => userTagsBlocked.find(tag => tag.tagId === gender) == null
   );

   if (translate) {
      return genders.map(gender => I18n.t(gender)).join(", ");
   } else {
      return genders.join(", ");
   }
}

/**
 * Users without cis genders or not liking cis gender will return false. Couple profiles also returns false.
 */
export function isAttractedToOppositeSex(
   userTagsSubscribed: TagBasicInfo[],
   userTagsBlocked: TagBasicInfo[],
   isCoupleProfile: boolean
) {
   if (isCoupleProfile) {
      return false;
   }

   const userCisGenders = CIS_GENDERS.filter(
      gender => userTagsSubscribed.find(tag => tag.tagId === gender) != null
   );
   const attractedTo = CIS_GENDERS.filter(
      gender => userTagsBlocked.find(tag => tag.tagId === gender) == null
   );

   if (userCisGenders.includes(Gender.Man) && attractedTo.includes(Gender.Woman)) {
      return true;
   }

   if (userCisGenders.includes(Gender.Woman) && attractedTo.includes(Gender.Man)) {
      return true;
   }

   return false;
}
