import {
   TagBasicInfo,
   TagsAsQuestion
} from "../../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { TagsToUpdate } from "../../RegistrationFormsPage";
import { TagsInfo } from "../TagsAsQuestionForm";

export function useTagAsQuestionInfo(
   tagsAsQuestions: TagsAsQuestion[],
   questionId: string,
   initialData: TagsInfo,
   selectedAnswer?: string,
   itsImportantChecked?: boolean
): UseTagInfoResponse {
   const question = tagsAsQuestions?.find(q => q.questionId === questionId);
   const initiallySelectedAnswer = getInitiallySelectedAnswer(
      question,
      initialData.tagsSubscribed
   )?.[0];
   const initiallySelectedAnswerIncompatibles = getIncompatibleAnswersOf(
      initiallySelectedAnswer,
      question
   );
   const selectedAnswerIncompatibles = getIncompatibleAnswersOf(selectedAnswer, question);
   const initiallyItsImportantChecked = getInitiallyItsImportantChecked({
      initiallySelectedAnswer: initiallySelectedAnswer?.[0],
      tagsBlocked: initialData.tagsBlocked,
      question
   });
   const tagsToUpdate = getTagsToUpdate({
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      initiallySelectedAnswerIncompatibles,
      itsImportantChecked,
      selectedAnswer,
      selectedAnswerIncompatibles
   });

   return {
      isLoading: tagsAsQuestions == null,
      question,
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      tagsToUpdate,
      itsImportantSelectorInvisible: question?.filterSelectionInvisible ?? false
   };
}

export interface UseTagInfoResponse {
   isLoading: boolean;
   question: TagsAsQuestion;
   initiallySelectedAnswer: string;
   initiallyItsImportantChecked: boolean;
   tagsToUpdate?: TagsToUpdate;
   itsImportantSelectorInvisible: boolean;
}

function getTagsToUpdate(props: {
   initiallySelectedAnswer: string;
   initiallyItsImportantChecked: boolean;
   initiallySelectedAnswerIncompatibles: string[];
   itsImportantChecked?: boolean;
   selectedAnswer?: string;
   selectedAnswerIncompatibles?: string[];
}): TagsToUpdate {
   const {
      initiallySelectedAnswer,
      initiallyItsImportantChecked,
      initiallySelectedAnswerIncompatibles,
      itsImportantChecked,
      selectedAnswer,
      selectedAnswerIncompatibles
   } = props;

   let tagsToUnsubscribe: string[] = [];
   let tagsToSubscribe: string[] = [];
   let tagsToBlock: string[] = [];
   let tagsToUnblock: string[] = [];

   if (selectedAnswer == null) {
      return null;
   }

   // User changed the answer
   if (initiallySelectedAnswer != selectedAnswer) {
      // If there was an answer selected previously remove the effects of the previous answer
      if (initiallySelectedAnswer != null) {
         tagsToUnsubscribe = [initiallySelectedAnswer];
         tagsToUnblock = initiallyItsImportantChecked ? initiallySelectedAnswerIncompatibles : [];
      }

      // Apply the effects of the new change made
      tagsToSubscribe = [selectedAnswer];

      // There is a special string in the id for the text only answers that prevents sending a tag subscription
      if (selectedAnswer.includes("no tag")) {
         tagsToSubscribe = [];
      }

      tagsToBlock = itsImportantChecked ? selectedAnswerIncompatibles : [];
   }

   // User didn't change the answer but changed the it's important checkbox
   if (initiallySelectedAnswer == selectedAnswer) {
      if (!itsImportantChecked && initiallyItsImportantChecked) {
         tagsToUnblock = initiallySelectedAnswerIncompatibles;
      }

      if (itsImportantChecked && !initiallyItsImportantChecked) {
         tagsToBlock = selectedAnswerIncompatibles;
      }
   }

   return {
      tagsToUnsubscribe,
      tagsToSubscribe,
      tagsToBlock,
      tagsToUnblock
   };
}

function getInitiallySelectedAnswer(
   question: TagsAsQuestion,
   tagsSubscribed: TagBasicInfo[]
): string[] {
   if (question == null || tagsSubscribed == null) {
      return [];
   }

   // If the user is subscribed to any of the answers then that answer is considered selected
   const optionSelected = question.answers.find(
      answer => tagsSubscribed?.find(subscribed => subscribed.tagId === answer.tagId) != null
   );

   if (optionSelected == null) {
      return [];
   }

   return [optionSelected.tagId];
}

function getInitiallyItsImportantChecked(props: {
   initiallySelectedAnswer: string;
   tagsBlocked: TagBasicInfo[];
   question: TagsAsQuestion;
}) {
   const { initiallySelectedAnswer, tagsBlocked, question } = props;

   if (question == null) {
      return false;
   }

   // If this is not null it means the user never answered this question. initiallySelectedAnswer comes from checking the tags subscribed.
   if (initiallySelectedAnswer == null) {
      return question?.filterSelectedByDefault ?? false;
   }

   const incompatibleAnswers = getIncompatibleAnswersOf(initiallySelectedAnswer, question);

   // If any incompatible answer is a tag blocked by the user then it's important is considered checked
   const incompatibleAnswerIsATagBlocked =
      incompatibleAnswers.find(
         incompatibleAnswer =>
            tagsBlocked?.find(tagBlocked => tagBlocked.tagId === incompatibleAnswer) != null
      ) != null;

   return incompatibleAnswerIsATagBlocked;
}

function getIncompatibleAnswersOf(answerId: string, question: TagsAsQuestion): string[] {
   if (answerId == null || question == null || question.incompatibilitiesBetweenAnswers == null) {
      return [];
   }

   const answerIndex = question.answers.findIndex(a => a.tagId === answerId);
   const incompatibleAnswersIndexes = question.incompatibilitiesBetweenAnswers[answerIndex];

   if (incompatibleAnswersIndexes == null || incompatibleAnswersIndexes.length === 0) {
      return [];
   }

   const incompatibleAnswers = question.answers.filter((a, i) =>
      incompatibleAnswersIndexes.includes(i)
   );

   return incompatibleAnswers.map(a => a.tagId);
}
