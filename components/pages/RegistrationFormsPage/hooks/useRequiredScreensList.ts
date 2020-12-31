import { useEffect, useState } from "react";
import {
   ProfileStatusServerResponse,
   UserPropAsQuestion
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserPropKey } from "../../../../api/server/shared-tools/validators/user";
import { usePropsAsQuestions } from "../../../../api/server/user";

/**
 * Get list of registration screens names to show, if the user has completed part of the registration
 * in the past, then some screens are not showed so this list based on the profileStatus.
 */
export const useRequiredFormList = (
   profileStatus: ProfileStatusServerResponse
): RequiredScreensResult => {
   const [formsRequired, setFormsRequired] = useState<RegistrationFormName[]>([]);
   const [
      formsRequiredWithPropsToChange,
      setFormsRequiredWithPropsToChange
   ] = useState<FormsAndTheirProps>({});
   const [otherQuestionProps, setOtherQuestionProps] = useState<string[]>([]);
   const { data: allPropsAsQuestions, isLoading: propsAsQuestionsLoading } = usePropsAsQuestions();

   useEffect(() => {
      /**
       * The list contains the screens name with the user props that each screen provides.
       * Also this list determines the order in which the screens will be displayed.
       * This determines which screen will be displayed based on the user props that are incomplete and
       * the user needs to provide information.
       */
      const formsForProps: FormsAndTheirProps = {
         GenderForm: ["gender"],
         TargetGenderForm: [
            "likesWoman",
            "likesMan",
            "likesWomanTrans",
            "likesManTrans",
            "likesOtherGenders"
         ],
         CoupleProfileForm: ["isCoupleProfile"],
         ThemeAsQuestionForm: [],
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

      let formsWithPropsRequired = getOnlyRequired(
         formsForProps,
         profileStatus.missingEditableUserProps,
         profileStatus.notShowedThemeQuestions
      );

      // The server could return props that are not known and are probably questions to make to the user and return to the server
      const unknownQuestionProps = profileStatus.missingEditableUserProps.filter(missingUserProp =>
         isUnknownQuestionProp(missingUserProp, formsForProps, allPropsAsQuestions)
      );

      formsWithPropsRequired = mergeKnownWithUnknown(formsWithPropsRequired, unknownQuestionProps);

      setFormsRequired(Object.keys(formsWithPropsRequired) as RegistrationFormName[]);
      setFormsRequiredWithPropsToChange(formsWithPropsRequired);
      setOtherQuestionProps(unknownQuestionProps);
   }, [profileStatus, allPropsAsQuestions]);

   return {
      isLoading: propsAsQuestionsLoading,
      formsRequired,
      formsRequiredWithPropsToChange,
      otherQuestionProps
   };
};

function isUnknownQuestionProp(
   prop: EditableUserPropKey,
   formsForProps: FormsAndTheirProps,
   allPropsAsQuestions: UserPropAsQuestion[]
): boolean {
   const isQuestionProp =
      allPropsAsQuestions.filter(q => q.answers.find(a => a.propName === prop) != null).length > 0;
   return Object.values(formsForProps).filter(p => p.includes(prop)).length === 0 && isQuestionProp;
}

function getOnlyRequired(
   formsForProps: FormsAndTheirProps,
   missingProps: EditableUserPropKey[],
   notShowedThemesAsQuestions: string[]
): FormsAndTheirProps {
   let formsWithPropsRequired: FormsAndTheirProps = {};

   Object.keys(formsForProps).forEach(key => {
      if (key === "ThemeAsQuestionForm") {
         if (notShowedThemesAsQuestions?.length > 0) {
            formsWithPropsRequired["ThemeAsQuestionForm"] = notShowedThemesAsQuestions;
         }
         return;
      }
      const propsOfForm = formsForProps[key] as EditableUserPropKey[];
      const formIsRequired = propsOfForm.some(prop => missingProps.includes(prop));
      if (formIsRequired) {
         formsWithPropsRequired[key] = propsOfForm;
      }
   });

   return formsWithPropsRequired;
}

function mergeKnownWithUnknown(
   known: FormsAndTheirProps,
   unknown: EditableUserPropKey[]
): FormsAndTheirProps {
   const result = { ...known };
   unknown.forEach(unknownProp => {
      result[unknownProp] = [unknownProp];
   });

   return result;
}

export interface RequiredScreensResult {
   isLoading: boolean;
   formsRequired: RegistrationFormName[];
   formsRequiredWithPropsToChange: FormsAndTheirProps;
   otherQuestionProps: string[];
}

export type FormsAndTheirProps = Partial<
   Record<RegistrationFormName, Array<EditableUserPropKey | string>>
>;

export type RegistrationFormName =
   | "BasicInfoForm"
   | "FiltersForm"
   | "ProfileImagesForm"
   | "DateIdeaForm"
   | "ProfileDescriptionForm"
   | "ThemeQuestionForm"
   | "TargetGenderForm"
   | "GenderForm"
   | "ThemeAsQuestionForm"
   | "CoupleProfileForm";
