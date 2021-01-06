import { ThemesToUpdate } from "./../RegistrationFormsPage";

export function useUnifiedThemesToUpdate(
   themesToUpdate: Record<string, ThemesToUpdate>
): ThemesToUpdate | null {
   if (themesToUpdate == null || Object.keys(themesToUpdate).length === 0) {
      return null;
   }

   let result: ThemesToUpdate = {
      themesToUnsubscribe: [],
      themesToSubscribe: [],
      themesToBlock: [],
      themesToUnblock: []
   };

   Object.values(themesToUpdate).forEach((themes: ThemesToUpdate) => {
      result = {
         themesToUnsubscribe: [...result.themesToUnsubscribe, ...themes.themesToUnsubscribe],
         themesToSubscribe: [...result.themesToSubscribe, ...themes.themesToSubscribe],
         themesToBlock: [...result.themesToBlock, ...themes.themesToBlock],
         themesToUnblock: [...result.themesToUnblock, ...themes.themesToUnblock]
      };
   });

   return result;
}
