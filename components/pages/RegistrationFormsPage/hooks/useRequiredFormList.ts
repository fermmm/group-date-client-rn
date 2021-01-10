import { useEffect, useState } from "react";
import {
   ProfileStatusServerResponse,
   UserPropAsQuestion
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserPropKey } from "../../../../api/server/shared-tools/validators/user";
import { usePropsAsQuestions } from "../../../../api/server/user";
import { mergeArraysAt } from "../../../../common-tools/js-tools/js-tools";

/**
 * Get list of registration screens names to show, if the user has completed part of the registration
 * in the past, then some screens are not showed so this list based on the profileStatus.
 */
export const useRequiredFormList = (
   profileStatus: ProfileStatusServerResponse
): RequiredScreensResult => {
   const [formsRequired, setFormsRequired] = useState<string[]>([]);
   const [
      knownFormsWithPropsTheyChange,
      setKnownFormsWithPropsTheyChange
   ] = useState<FormsAndTheirProps>({});
   const { data: allPropsAsQuestions, isLoading: propsAsQuestionsLoading } = usePropsAsQuestions();
   const [unknownPropsQuestions, setUnknownPropsQuestions] = useState<string[]>([]);
   const [themesAsQuestionsToShow, setThemesAsQuestionsToShow] = useState<string[]>([]);

   useEffect(() => {
      if (profileStatus == null || allPropsAsQuestions == null) {
         return;
      }

      /**
       * The list contains the screens name with the user props that each screen is related with (if any).
       * Also this list determines the order in which the screens will be displayed.
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
         ThemesAsQuestionsForms: [],
         UnknownPropsQuestionForms: [],
         DateIdeaForm: ["dateIdea"],
         BasicInfoForm: [
            "name",
            "birthDate",
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

      /**
       * Only include the required elements (user may have an already started registration
       * process before and not all the forms are required to be rendered)
       */
      let _formsRequired: string[] = getOnlyRequired(
         Object.keys(formsForProps) as RegistrationFormName[],
         formsForProps,
         profileStatus.missingEditableUserProps
      );

      /*
       * The server could return props that are not known by the client but are present in the question list, this means
       * we should show the question and update the required props. Here we filter the unknown props to get only the ones
       * that are questions.
       */
      const unknownProps = getUnknownQuestionsProps(
         profileStatus.missingEditableUserProps,
         formsForProps,
         allPropsAsQuestions
      );

      /**
       * Replace "UnknownPropsQuestionForms" with the list of unknown props, if there are no unknown props then
       * "UnknownPropsQuestionForms" gets removed anyway.
       */
      _formsRequired = mergeArraysAt(
         _formsRequired.indexOf("UnknownPropsQuestionForms"),
         unknownProps,
         _formsRequired,
         { replace: true }
      );

      /**
       * Replace "ThemesAsQuestionsForms" with the list of theme as questions ids, if there are none then
       * "ThemesAsQuestionsForms" gets removed anyway.
       */
      _formsRequired = mergeArraysAt(
         _formsRequired.indexOf("ThemesAsQuestionsForms"),
         profileStatus?.notShowedThemeQuestions,
         _formsRequired,
         { replace: true }
      );

      setFormsRequired(_formsRequired);
      setKnownFormsWithPropsTheyChange(formsForProps);
      setUnknownPropsQuestions(unknownProps);
      setThemesAsQuestionsToShow(profileStatus?.notShowedThemeQuestions ?? []);
   }, [profileStatus, allPropsAsQuestions]);

   return {
      isLoading: propsAsQuestionsLoading,
      formsRequired,
      knownFormsWithPropsTheyChange,
      unknownPropsQuestions,
      themesAsQuestionsToShow
   };
};

export interface RequiredScreensResult {
   isLoading: boolean;
   /**
    * This list contains all form names of the forms that are required to be rendered, in order.
    * For the themes as questions, the theme id is present.
    * For the unknown props that are questions, the prop is present.
    * Also the same information of this list is present divided into the other 3 lists:
    *    knownFormsWithPropsTheyChange
    *    unknownQuestionsProps
    *    themesAsQuestionsToShow
    */
   formsRequired: string[];
   knownFormsWithPropsTheyChange: FormsAndTheirProps;
   unknownPropsQuestions: string[];
   themesAsQuestionsToShow: string[];
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
   | "CoupleProfileForm"
   | "ThemesAsQuestionsForms"
   | "UnknownPropsQuestionForms";

function getUnknownQuestionsProps(
   missingEditableUserProps: string[],
   formsForProps: FormsAndTheirProps,
   allPropsAsQuestions: UserPropAsQuestion[]
): string[] {
   return missingEditableUserProps.filter(missingProp =>
      isUnknownQuestionProp(missingProp, formsForProps, allPropsAsQuestions)
   );
}

function isUnknownQuestionProp(
   prop: string,
   formsForProps: FormsAndTheirProps,
   allPropsAsQuestions: UserPropAsQuestion[]
): boolean {
   const isQuestionProp =
      allPropsAsQuestions.filter(q => q.answers.find(a => a.propName === prop) != null).length > 0;
   return Object.values(formsForProps).filter(p => p.includes(prop)).length === 0 && isQuestionProp;
}

function getOnlyRequired(
   formNames: RegistrationFormName[],
   formsForProps: FormsAndTheirProps,
   missingProps: EditableUserPropKey[]
): RegistrationFormName[] {
   return formNames.filter(formName => {
      // These forms will be included always because are removed in another place
      if (formName === "UnknownPropsQuestionForms" || formName === "ThemesAsQuestionsForms") {
         return true;
      }
      const propsOfForm = formsForProps[formName] as EditableUserPropKey[];
      const formIsRequired = propsOfForm.some(prop => missingProps.includes(prop));
      return formIsRequired;
   });
}
