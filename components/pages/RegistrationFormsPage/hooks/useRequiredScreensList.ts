import { ProfileStatusServerResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserPropKey } from "../../../../api/server/shared-tools/validators/user";

export function useRequiredScreensList(
   profileStatus: ProfileStatusServerResponse
): RegistrationScreensNames[] {
   let screens: RegistrationScreensNames[] = [];

   if (profileStatus?.notShowedThemeQuestions?.length > 0) {
      screens.push("ThemeQuestionForm");
   }

   /**
    * The list contains the screens name with the user props that each screen provides.
    * Also this list determines the order in which the screens will be displayed.
    * This determines which screen will be displayed based on the user props that are incomplete and
    * the user needs to provide information.
    */
   const formScreenToUserProps: Partial<Record<RegistrationScreensNames, EditableUserPropKey[]>> = {
      PropsAsQuestionsForm: [
         "gender",
         "likesWoman",
         "likesMan",
         "likesWomanTrans",
         "likesManTrans",
         "likesOtherGenders",
         "isCoupleProfile"
      ],
      DateIdeaForm: ["dateIdea"],
      BasicInfoForm: [
         "name",
         "age",
         "height",
         "targetAgeMin",
         "targetAgeMax",
         "targetDistance",
         "locationLat",
         "locationLon",
         "cityName",
         "country"
      ],
      ProfilePicturesForm: ["images"],
      ProfileDescriptionForm: ["profileDescription"]
   };

   let formScreens = Object.keys(formScreenToUserProps) as RegistrationScreensNames[];
   formScreens = formScreens.filter(screen =>
      formScreenToUserProps[screen].some(s => profileStatus?.missingEditableUserProps?.includes(s))
   );

   screens = [...screens, ...formScreens];

   return screens;
}

export type RegistrationScreensNames =
   | "BasicInfoForm"
   | "ProfilePicturesForm"
   | "DateIdeaForm"
   | "ProfileDescriptionForm"
   | "ThemeQuestionForm"
   | "PropsAsQuestionsForm";
