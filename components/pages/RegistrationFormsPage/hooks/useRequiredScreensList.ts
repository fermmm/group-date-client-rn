import { useEffect, useState } from "react";
import { ProfileStatusServerResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserPropKey } from "../../../../api/server/shared-tools/validators/user";

/**
 * Get list of registration screens names to show, if the user has completed part of the registration
 * in the past, then some screens are not showed so this list based on the profileStatus.
 */
export const useRequiredFormList = (
   profileStatus: ProfileStatusServerResponse
): RequiredScreensResult => {
   const [formsRequired, setFormsRequired] = useState<RegistrationFormName[]>([]);
   const [formsRequiredWithPropsToChange, setFormsRequiredWithPropsToChange] = useState<
      Partial<Record<RegistrationFormName, EditableUserPropKey[]>>
   >({});

   useEffect(() => {
      // if (profileStatus?.notShowedThemeQuestions?.length > 0) {
      //    screens.push("ThemeQuestionForm");
      // }

      /**
       * The list contains the screens name with the user props that each screen provides.
       * Also this list determines the order in which the screens will be displayed.
       * This determines which screen will be displayed based on the user props that are incomplete and
       * the user needs to provide information.
       */
      const formsForProps: Partial<Record<RegistrationFormName, EditableUserPropKey[]>> = {
         GenderForm: ["gender"],
         TargetGenderForm: [
            "likesWoman",
            "likesMan",
            "likesWomanTrans",
            "likesManTrans",
            "likesOtherGenders"
         ],
         CoupleProfileForm: ["isCoupleProfile"],
         DateIdeaForm: ["dateIdea"],
         BasicInfoForm: [
            "name",
            "age",
            "height",
            "locationLat",
            "locationLon",
            "cityName",
            "country"
         ],
         FiltersForm: ["targetAgeMin", "targetAgeMax", "targetDistance"],
         ProfileImagesForm: ["images"],
         ProfileDescriptionForm: ["profileDescription"]
      };

      let formsWithPropsRequired: Partial<Record<RegistrationFormName, EditableUserPropKey[]>> = {};

      Object.keys(formsForProps).forEach(key => {
         const propsOfForm = formsForProps[key] as EditableUserPropKey[];
         const formIsRequired = propsOfForm.some(prop =>
            profileStatus?.missingEditableUserProps?.includes(prop)
         );
         if (formIsRequired) {
            formsWithPropsRequired[key] = propsOfForm;
         }
      });

      setFormsRequired(Object.keys(formsWithPropsRequired) as RegistrationFormName[]);
      setFormsRequiredWithPropsToChange(formsWithPropsRequired);
   }, [profileStatus]);

   return { formsRequired, formsRequiredWithPropsToChange };
};

export interface RequiredScreensResult {
   formsRequired: RegistrationFormName[];
   formsRequiredWithPropsToChange: Partial<Record<RegistrationFormName, EditableUserPropKey[]>>;
}

export type RegistrationFormName =
   | "BasicInfoForm"
   | "FiltersForm"
   | "ProfileImagesForm"
   | "DateIdeaForm"
   | "ProfileDescriptionForm"
   | "ThemeQuestionForm"
   | "TargetGenderForm"
   | "GenderForm"
   | "CoupleProfileForm";
