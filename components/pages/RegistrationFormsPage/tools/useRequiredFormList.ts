import { useEffect, useState } from "react";
import {
   AnswerIds,
   ProfileStatusServerResponse,
   Question
} from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import {
   EditableUserPropKey,
   RequiredUserPropKey
} from "../../../../api/server/shared-tools/validators/user";
import { mergeArraysAt } from "../../../../common-tools/js-tools/js-tools";
import { ParamsRegistrationFormsPage } from "../RegistrationFormsPage";
import { getOtherResponses } from "./questions-tools";

/**
 * The list contains the screens name with the user props that each screen is related with (if any).
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
   TargetGenderForm: ["likesGenders"],
   DateIdeaForm: ["dateIdea"],
   FiltersForm: ["targetAgeMin", "targetAgeMax", "targetDistance"],
   ProfileImagesForm: ["images"],
   ProfileDescriptionForm: ["profileDescription"]
};

/**
 * This list determines the order in which the screens are going to appear.
 */
const formNamesInOrder: RegistrationFormName[] = [
   "BasicInfoForm",
   "GenderForm",
   "QuestionsForm",
   "TargetGenderForm",
   "DateIdeaForm",
   "FiltersForm",
   "ProfileImagesForm",
   "ProfileDescriptionForm"
];

/**
 * Get list of registration screens names to show based on a requirements list (requirements source).
 */
export const useRequiredFormList = (
   requirementSource: {
      fromProfileStatus?: ProfileStatusServerResponse;
      fromParams?: ParamsRegistrationFormsPage;
   } = {},
   allQuestions: Question[]
): RequiredScreensResult => {
   const [formsRequired, setFormsRequired] = useState<string[]>([]);
   const [questionsToShow, setQuestionsToShow] = useState<string[]>([]);

   const update = (params?: { questionsResponded?: AnswerIds[] }) => {
      const { questionsResponded } = params ?? {};

      let forms: string[] = [];
      let questions: string[] = [];

      // This if only executes for settings page, not from registration
      if (requirementSource.fromProfileStatus == null && requirementSource.fromParams != null) {
         questions = removeNotRequiredQuestions(
            requirementSource.fromParams?.questionToShow ?? [],
            questionsResponded,
            allQuestions
         );
         forms = [...(requirementSource.fromParams?.formsToShow ?? []), ...questions];
      }

      // This if only executes for registration, not from the settings menu
      if (
         requirementSource.fromParams == null &&
         requirementSource.fromProfileStatus != null &&
         allQuestions
      ) {
         questions = removeNotRequiredQuestions(
            requirementSource.fromProfileStatus.notRespondedQuestions ?? [],
            questionsResponded,
            allQuestions
         );
         forms = getOnlyRequiredForms(
            questions,
            requirementSource.fromProfileStatus.missingEditableUserProps
         );
      }

      setFormsRequired(forms);
      setQuestionsToShow(questions);
   };

   // You may want to replace the deps here requirementSource.fromParams and requirementSource.fromProfileStatus by just requirementSource but that crashes the app because the reference is re-created all the time
   useEffect(update, [
      allQuestions,
      requirementSource.fromParams,
      requirementSource.fromProfileStatus
   ]);

   return {
      formsRequired,
      questionsToShow,
      update
   };
};

/**
 * Only includes the forms that are required in the profile status request (user may have an already started registration
 * process before and not all the forms are required to be rendered)
 */
function getOnlyRequiredForms(
   notRespondedQuestions: string[],
   missingEditableUserProps: RequiredUserPropKey[]
): string[] {
   let result: string[] = [...formNamesInOrder];

   /**
    * Replaces the item "QuestionsForm" with the list of tag as questions ids, if there are none then
    * "QuestionsForm" gets removed anyway.
    */
   result = mergeArraysAt(result.indexOf("QuestionsForm"), notRespondedQuestions, result, {
      replace: true
   });

   result = result.filter(formName => {
      const propsOfForm = formsForProps[formName] as RequiredUserPropKey[];
      // At this point formNames may contain questions ids so in case some is found we continue
      if (propsOfForm == null) {
         return true;
      }
      const formIsRequired = propsOfForm.some(prop => missingEditableUserProps?.includes(prop));
      return formIsRequired;
   });
   return result;
}

/**
 * With the current list of responses the user is sending we can remove questions that are automatically
 * responded when responding a previous question, this returns only the questions ids that are still required
 */
function removeNotRequiredQuestions(
   questionIds: string[],
   questionsResponded: AnswerIds[],
   allQuestions: Question[]
): string[] {
   if (questionsResponded == null || questionsResponded.length === 0 || allQuestions == null) {
      return questionIds;
   }

   const result = new Set(questionIds);
   questionsResponded.forEach(q => {
      getOtherResponses(q, allQuestions).forEach(a => {
         result.delete(a.questionId);
      });
   });

   return Array.from(result);
}

export interface RequiredScreensResult {
   /**
    * This list contains all form names of the forms that are required to be rendered, in order.
    */
   formsRequired: string[];
   questionsToShow: string[];
   update: (params?: { questionsResponded?: AnswerIds[] }) => void;
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
   | "TargetGenderForm"
   | "GenderForm"
   | "QuestionsForm";
