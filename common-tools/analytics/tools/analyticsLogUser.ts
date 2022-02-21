import * as Analytics from "expo-firebase-analytics";
import Constants, { AppOwnership } from "expo-constants";
import { CIS_GENDERS, User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { fromBirthDateToAge } from "../../../api/tools/date-tools";
import { isAttractedToOppositeSex } from "../../strings/gender";
import { LOG_ANALYTICS } from "../../../config";

export function analyticsLogUser(user: Partial<User>) {
   if (user == null) {
      return;
   }

   /**
    * If we send props without profile completed the information
    * related with the tags will be incorrect. Example: An incomplete
    * profile has no tags subscribed, this means the user likes
    * all genders but it's not the case.
    */
   const userPropertiesAnalytics = user.profileCompleted
      ? getUserPropertiesInAnalyticsFormat(user)
      : {};

   if (Constants.appOwnership !== AppOwnership.Expo) {
      Analytics.setUserId(user.userId);
      Analytics.setUserProperties(userPropertiesAnalytics);
   }

   if (LOG_ANALYTICS) {
      console.log("///////////////////////////////////////");
      console.log(`Analytics log user`);
      console.log(userPropertiesAnalytics);
      console.log("///////////////////////////////////////");
   }
}

/**
 * Firebase analytics supports a maximum of 25 user properties with a maximum of 24 characters
 * in the name of the property
 */
export function getUserPropertiesInAnalyticsFormat(user: Partial<User>): Record<string, string> {
   const userProperties = {
      country: user.country,
      age: user.birthDate ? fromBirthDateToAge(user.birthDate) : undefined,
      cityName: user.cityName,
      height: user.height,
      isCoupleProfile: user.isCoupleProfile,
      language: user.language,
      targetAgeMin: user.targetAgeMin,
      targetAgeMax: user.targetAgeMax,
      targetDistance: user.targetDistance,
      genderCis: user.genders.filter(gender => CIS_GENDERS.includes(gender)),
      attractedToCis: user.likesGenders.filter(gender => CIS_GENDERS.includes(gender)),
      attractedToOppositeSex: isAttractedToOppositeSex(
         user.genders,
         user.likesGenders,
         user.isCoupleProfile
      ),
      likesGroupSex: user.tagsSubscribed.find(tag => tag.tagId === "q01-a00") != null,
      likesFeminism: user.tagsSubscribed.find(tag => tag.tagId === "q00-a00") != null,
      likesToMeetPeople: user.tagsSubscribed.find(tag => tag.tagId === "q02-a01") != null,
      blocksGroupSex: user.tagsBlocked.find(tag => tag.tagId === "q01-a00") != null,
      blocksGroupSexDislikers: user.tagsBlocked.find(tag => tag.tagId === "q01-a01") != null,
      blocksFeminism: user.tagsBlocked.find(tag => tag.tagId === "q00-a00") != null,
      blocksFeminismDislikers: user.tagsBlocked.find(tag => tag.tagId === "q00-a01") != null,
      blocksPromoters: user.tagsBlocked.find(tag => tag.tagId === "q02-a00") != null
   };

   /**
    * Removed undefined values and converts all to string before sending.
    */
   const userPropertiesReadyToSend: Record<string, string> = {};
   Object.keys(userProperties).forEach(key => {
      if (
         userProperties[key] == null ||
         userProperties[key] === "" ||
         (Array.isArray(userProperties[key]) && userProperties[key].length === 0)
      ) {
         return;
      }

      userPropertiesReadyToSend[key] = String(userProperties[key]);
   });

   return userPropertiesReadyToSend;
}
