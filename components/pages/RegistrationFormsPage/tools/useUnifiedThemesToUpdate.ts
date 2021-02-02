import { ThemesToUpdate } from "../RegistrationFormsPage";

export function useUnifiedThemesToUpdate(
   questionIdsWithThemes: Record<string, ThemesToUpdate>
): UseUnifiedThemesToUpdate | null {
   if (questionIdsWithThemes == null || Object.keys(questionIdsWithThemes).length === 0) {
      return { unifiedThemesToUpdate: null, questionsShowed: null };
   }

   let unifiedThemesToUpdate: ThemesToUpdate = {
      themesToUnsubscribe: [],
      themesToSubscribe: [],
      themesToBlock: [],
      themesToUnblock: []
   };

   let questionsShowed: string[] = [];

   Object.keys(questionIdsWithThemes).forEach(questionId => {
      const themes = questionIdsWithThemes[questionId];

      questionsShowed = [...questionsShowed, questionId];
      unifiedThemesToUpdate = {
         themesToUnsubscribe: [
            ...unifiedThemesToUpdate.themesToUnsubscribe,
            ...themes.themesToUnsubscribe
         ],
         themesToSubscribe: [
            ...unifiedThemesToUpdate.themesToSubscribe,
            ...themes.themesToSubscribe
         ],
         themesToBlock: [...unifiedThemesToUpdate.themesToBlock, ...themes.themesToBlock],
         themesToUnblock: [...unifiedThemesToUpdate.themesToUnblock, ...themes.themesToUnblock]
      };
   });

   return { unifiedThemesToUpdate, questionsShowed };
}

export interface UseUnifiedThemesToUpdate {
   unifiedThemesToUpdate: ThemesToUpdate;
   questionsShowed?: string[];
}
