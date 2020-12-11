import { ProfileStatusServerResponse } from "../server/shared-tools/endpoints-interfaces/user";

export function userFinishedRegistration(profileStatus: ProfileStatusServerResponse): boolean {
   if (profileStatus == null) {
      return false;
   }
   const { missingEditableUserProps = [], notShowedThemeQuestions = [] } = profileStatus;
   return missingEditableUserProps.length === 0 && notShowedThemeQuestions.length === 0;
}
