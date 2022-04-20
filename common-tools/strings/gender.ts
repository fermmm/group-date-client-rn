import I18n from "i18n-js";
import {
   CIS_GENDERS,
   NON_CIS_GENDERS
} from "./../../api/server/shared-tools/endpoints-interfaces/user";
import { Gender } from "../../api/server/shared-tools/endpoints-interfaces/user";

export function getGenderName(
   genders: Gender[],
   isCoupleProfile: boolean,
   translate: boolean = true
): string {
   if (isCoupleProfile) {
      return "Pareja";
   }

   if (genders == null) {
      return "Género desconocido";
   }

   let finalVisualizedGenders = [...genders];

   // non-cis gender users want to display only non-cis genders in their profile, so we hide cis genders if there is any.
   if (!userIsCisGender(genders)) {
      // Remove cis genders
      finalVisualizedGenders = finalVisualizedGenders.filter(gender =>
         NON_CIS_GENDERS.includes(gender)
      );
   }

   if (translate) {
      return finalVisualizedGenders.map(gender => I18n.t(gender)).join(", ");
   } else {
      return finalVisualizedGenders.join(", ");
   }
}

/**
 * Users without cis genders or not liking cis gender will return false. Couple profiles also returns false.
 */
export function isAttractedToOppositeSex(
   userGenders: Gender[],
   likedGenders: Gender[],
   isCoupleProfile: boolean
) {
   if (isCoupleProfile) {
      return false;
   }

   const userCisGenders = userGenders.filter(gender => CIS_GENDERS.includes(gender));
   const cisGenderLiked = likedGenders.filter(gender => CIS_GENDERS.includes(gender));

   if (userCisGenders.includes(Gender.Man) && cisGenderLiked.includes(Gender.Woman)) {
      return true;
   }

   if (userCisGenders.includes(Gender.Woman) && cisGenderLiked.includes(Gender.Man)) {
      return true;
   }

   return false;
}

export function userIsCisGender(userGenders: Gender[]) {
   return userGenders.find(gender => NON_CIS_GENDERS.includes(gender)) == null;
}
