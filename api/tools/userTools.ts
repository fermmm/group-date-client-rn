import { ProfileStatusServerResponse } from "../server/shared-tools/endpoints-interfaces/user";

export function userHasFinishedRegistration(profileStatus: ProfileStatusServerResponse): boolean {
   if (profileStatus == null) {
      return null;
   }

   const {
      missingEditableUserProps = [],
      notShowedTagQuestions = [],
      genderIsSelected,
      targetGenderIsSelected
   } = profileStatus;

   return (
      missingEditableUserProps.length === 0 &&
      notShowedTagQuestions.length === 0 &&
      genderIsSelected &&
      targetGenderIsSelected
   );
}
