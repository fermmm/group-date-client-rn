import { AnswerIds, Question } from "../../../../api/server/shared-tools/endpoints-interfaces/user";

/**
 * Some questions responds other questions, this function finds all the questions that are responded by an answer, the full tree.
 */
export function getOtherResponses(targetAnswer: AnswerIds, allQuestions: Question[]) {
   const result: AnswerIds[] = [];
   const questionsDone = new Set<string>([targetAnswer.questionId]);

   const iterateQuestions = (targetAnswer: AnswerIds) => {
      const question = allQuestions.find(q => q.questionId === targetAnswer.questionId);
      const answer = question.answers.find(a => a.answerId === targetAnswer.answerId);
      answer.answersOtherQuestions?.forEach(a => {
         if (!questionsDone.has(a.questionId)) {
            result.push(a);
            questionsDone.add(a.questionId);
            iterateQuestions(a);
         }
      });
   };

   iterateQuestions(targetAnswer);
   return result;
}

/**
 * Loops a list of responses and deletes the ones that are automatically responded by previous ones.
 * This may be useful because the user can go back and change a response and this updated response may
 * change the following ones.
 */
export function removeQuestionsRespondedByOtherQuestions(
   questionsResponded: AnswerIds[],
   allQuestions: Question[]
): AnswerIds[] {
   if (questionsResponded == null || questionsResponded.length === 0 || allQuestions == null) {
      return questionsResponded;
   }

   const result = new Set(questionsResponded.map(q => q.questionId));
   questionsResponded.forEach(q => {
      getOtherResponses(q, allQuestions).forEach(a => {
         result.delete(a.questionId);
      });
   });

   return questionsResponded.filter(q => result.has(q.questionId));
}
