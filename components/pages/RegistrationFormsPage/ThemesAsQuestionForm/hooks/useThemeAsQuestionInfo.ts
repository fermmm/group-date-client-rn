import { ThemesToUpdate } from "../../RegistrationFormsPage";
import {
   ThemeBasicInfo,
   ThemesAsQuestion
} from "../../../../../api/server/shared-tools/endpoints-interfaces/themes";
import { useThemesAsQuestions } from "../../../../../api/server/themes";
import { ThemesInfo } from "../ThemesAsQuestionForm";

export function useThemeAsQuestionInfo(
   questionId: string,
   initialData: ThemesInfo,
   selectedAnswer?: string,
   itsImportantChecked?: boolean
): UseThemeInfoResponse {
   const { data: themesAsQuestions, isLoading } = useThemesAsQuestions();

   const question = themesAsQuestions?.find(q => q.questionId === questionId);
   const initiallySelectedAnswer = getInitiallySelectedAnswer(
      question,
      initialData.themesSubscribed
   )?.[0];
   const initiallySelectedAnswerIncompatibles = getIncompatibleAnswersOf(
      initiallySelectedAnswer,
      question
   );
   const selectedAnswerIncompatibles = getIncompatibleAnswersOf(selectedAnswer, question);
   const initiallyItsImportantChecked = getInitiallyItsImportantChecked(
      initiallySelectedAnswer?.[0],
      initialData.themesBlocked,
      question
   );
   const themesToUpdate = getThemesToUpdate({
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      initiallySelectedAnswerIncompatibles,
      itsImportantChecked,
      selectedAnswer,
      selectedAnswerIncompatibles
   });

   return {
      isLoading,
      question,
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      themesToUpdate
   };
}

export interface UseThemeInfoResponse {
   isLoading: boolean;
   question: ThemesAsQuestion;
   initiallySelectedAnswer: string;
   initiallyItsImportantChecked: boolean;
   themesToUpdate?: ThemesToUpdate;
}

function getThemesToUpdate(props: {
   initiallySelectedAnswer: string;
   initiallyItsImportantChecked: boolean;
   initiallySelectedAnswerIncompatibles: string[];
   itsImportantChecked?: boolean;
   selectedAnswer?: string;
   selectedAnswerIncompatibles?: string[];
}): ThemesToUpdate {
   const {
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      initiallySelectedAnswerIncompatibles,
      itsImportantChecked,
      selectedAnswer,
      selectedAnswerIncompatibles
   } = props;

   let themesToUnsubscribe: string[] = [];
   let themesToSubscribe: string[] = [];
   let themesToBlock: string[] = [];
   let themesToUnblock: string[] = [];

   if (selectedAnswer == null) {
      return null;
   }

   // User changed the answer
   if (initiallySelectedAnswer != selectedAnswer) {
      // If there was an answer selected previously remove the effects of the previous answer
      if (initiallySelectedAnswer != null) {
         themesToUnsubscribe = [initiallySelectedAnswer];
         themesToUnblock = initiallyItsImportantChecked ? initiallySelectedAnswerIncompatibles : [];
      }

      // Apply the effects of the new change made
      themesToSubscribe = [selectedAnswer];
      themesToBlock = itsImportantChecked ? selectedAnswerIncompatibles : [];
   }

   // User didn't change the answer but changed the it's important checkbox
   if (initiallySelectedAnswer == selectedAnswer) {
      if (!itsImportantChecked && initiallyItsImportantChecked) {
         themesToUnblock = initiallySelectedAnswerIncompatibles;
      }

      if (itsImportantChecked && !initiallyItsImportantChecked) {
         themesToBlock = selectedAnswerIncompatibles;
      }
   }

   return {
      themesToUnsubscribe,
      themesToSubscribe,
      themesToBlock,
      themesToUnblock
   };
}

function getInitiallySelectedAnswer(
   question: ThemesAsQuestion,
   themesSubscribed: ThemeBasicInfo[]
): string[] {
   if (question == null || themesSubscribed == null) {
      return [];
   }

   // If the user is subscribed to any of the answers then that answer is considered selected
   const optionSelected = question.answers.find(
      answer => themesSubscribed?.find(subscribed => subscribed.themeId === answer.themeId) != null
   );

   if (optionSelected == null) {
      return [];
   }

   return [optionSelected.themeId];
}

function getInitiallyItsImportantChecked(
   initiallySelectedAnswer: string,
   themesBlocked: ThemeBasicInfo[],
   question: ThemesAsQuestion
) {
   if (question == null || initiallySelectedAnswer == null) {
      return false;
   }

   const incompatibleAnswers = getIncompatibleAnswersOf(initiallySelectedAnswer, question);

   // If any incompatible answer is a theme blocked by the user then it's important is considered checked
   const incompatibleAnswerIsBlocked = incompatibleAnswers.find(
      incompatibleAnswer =>
         themesBlocked?.find(themeBlocked => themeBlocked.themeId === incompatibleAnswer) != null
   );

   return incompatibleAnswerIsBlocked != null;
}

function getIncompatibleAnswersOf(answerId: string, question: ThemesAsQuestion): string[] {
   if (answerId == null || question == null || question.incompatibilitiesBetweenAnswers == null) {
      return [];
   }

   const answerIndex = question.answers.findIndex(a => a.themeId === answerId);
   const incompatibleAnswersIndexes = question.incompatibilitiesBetweenAnswers[answerIndex];

   if (incompatibleAnswersIndexes == null || incompatibleAnswersIndexes.length === 0) {
      return [];
   }

   const incompatibleAnswers = question.answers.filter((a, i) =>
      incompatibleAnswersIndexes.includes(i)
   );

   return incompatibleAnswers.map(a => a.themeId);
}
