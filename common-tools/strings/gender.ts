import I18n from "i18n-js";
import { ALL_GENDERS } from "./../../api/server/shared-tools/endpoints-interfaces/user";
import { TagBasicInfo } from "./../../api/server/shared-tools/endpoints-interfaces/tags";
import { Gender } from "../../api/server/shared-tools/endpoints-interfaces/user";

export function getGenderName(
   userTagsSubscribed: TagBasicInfo[],
   isCoupleProfile: boolean
): string {
   if (isCoupleProfile) {
      return "Pareja";
   }
   const userGenders = userTagsSubscribed.filter(tag => ALL_GENDERS.includes(tag.tagId as Gender));
   return userGenders.map(tag => I18n.t(tag.name)).join(", ");
}
