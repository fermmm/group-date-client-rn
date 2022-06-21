import { useEffect, useState } from "react";
import { ProfileStatusServerResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import {
   EditableUserPropKey,
   RequiredUserPropKey
} from "../../../../api/server/shared-tools/validators/user";
import { useQuestions } from "../../../../api/server/user";
import { mergeArraysAt } from "../../../../common-tools/js-tools/js-tools";
import { ParamsRegistrationFormsPage } from "../RegistrationFormsPage";

/**
 * Get list of registration screens names to show based on a requirements list (requirements source).
 */
export const useRequiredFormList = (
   requirementSource: {
      fromProfileStatus?: ProfileStatusServerResponse;
      fromParams?: ParamsRegistrationFormsPage;
   } = {}
): RequiredScreensResult => {
   /**
    * The list contains the screens name with the user props that each screen is related with (if any).
    * Also this list determines the order in which the screens will be displayed.
    */
   const formsForProps: FormsAndTheirProps = {
      BasicInfoForm: [
         "name",
         "birthDate",
         "height",
         "locationLat",
         "locationLon",
         "cityName",
         "country"
      ],
      GenderForm: ["genders"],
      QuestionsForm: [], // This empty element will be replaced later
      TargetGenderForm: ["likesGenders"],
      DateIdeaForm: ["dateIdea"],

      FiltersForm: ["targetAgeMin", "targetAgeMax", "targetDistance"],
      ProfileImagesForm: ["images"],
      ProfileDescriptionForm: ["profileDescription"]
   };

   const [formsRequired, setFormsRequired] = useState<string[]>([]);
   const { data: allQuestions, isLoading } = useQuestions({
      config: {
         enabled:
            requirementSource.fromParams?.questionToShow != null ||
            requirementSource.fromProfileStatus != null
      }
   });

   console.log(allQuestions);
   const [questionsToShow, setQuestionsToShow] = useState<string[]>([]);

   // This effect only executes for registration, not from the settings menu
   useEffect(() => {
      if (
         requirementSource.fromParams != null ||
         requirementSource.fromProfileStatus == null ||
         !allQuestions
      ) {
         return;
      }

      /**
       * Only include the required elements (user may have an already started registration
       * process before and not all the forms are required to be rendered)
       */
      let _formsRequired: string[] = getOnlyRequired(
         Object.keys(formsForProps) as RegistrationFormName[],
         formsForProps,
         requirementSource.fromProfileStatus
      );

      /**
       * Replace "QuestionsForm" with the list of tag as questions ids, if there are none then
       * "QuestionsForm" gets removed anyway.
       */
      _formsRequired = mergeArraysAt(
         _formsRequired.indexOf("QuestionsForm"),
         requirementSource.fromProfileStatus.notRespondedQuestions,
         _formsRequired,
         { replace: true }
      );

      setFormsRequired(_formsRequired);
      setQuestionsToShow(requirementSource.fromProfileStatus.notRespondedQuestions ?? []);
   }, [requirementSource.fromProfileStatus, allQuestions]);

   // This effect only executes for settings page, not from registration
   useEffect(() => {
      if (requirementSource.fromProfileStatus != null || requirementSource.fromParams == null) {
         return;
      }

      /**
       * Replace "QuestionsForm" with the list of tag as questions ids, if there are none then
       * "QuestionsForm" gets removed anyway.
       */
      const _formsRequired = requirementSource.fromParams?.formsToShow ?? [];

      // TODO: Esto es todo muy raro tal vez se podria repensar, parace que tengo que agregarle al array algo que esta fuera del tipo que es el ID de la pregunta
      if (requirementSource.fromParams?.questionToShow?.length > 0) {
         _formsRequired.push(
            // @ts-ignore
            ...(requirementSource.fromParams?.questionToShow as RegistrationFormName)
         );
      }

      setFormsRequired(_formsRequired);
      setQuestionsToShow(requirementSource.fromParams?.questionToShow ?? []);
   }, [requirementSource.fromParams]);

   return {
      isLoading,
      formsRequired,
      questionsToShow
   };
};

export interface RequiredScreensResult {
   isLoading: boolean;
   /**
    * This list contains all form names of the forms that are required to be rendered, in order.
    */
   formsRequired: string[];
   questionsToShow: string[];
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
   | "TagQuestionForm"
   | "TargetGenderForm"
   | "GenderForm"
   | "CoupleProfileForm"
   | "QuestionsForm";

function getOnlyRequired(
   formNames: RegistrationFormName[],
   formsForProps: FormsAndTheirProps,
   profileStatus: ProfileStatusServerResponse
): RegistrationFormName[] {
   return formNames.filter(formName => {
      // This form will be included always because is removed in another place
      if (formName === "QuestionsForm") {
         return true;
      }

      const propsOfForm = formsForProps[formName] as RequiredUserPropKey[];
      const formIsRequired = propsOfForm.some(prop =>
         profileStatus?.missingEditableUserProps?.includes(prop)
      );
      return formIsRequired;
   });
}
