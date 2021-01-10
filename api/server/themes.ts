import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import {
   defaultErrorHandler,
   defaultOptionsForMutations,
   defaultHttpRequest,
   MutationExtraOptions,
   RequestError
} from "../tools/reactQueryTools";
import { BasicThemeParams, ThemesAsQuestion } from "./shared-tools/endpoints-interfaces/themes";

export function useThemesAsQuestions<T extends ThemesAsQuestion[]>(options?: UseQueryOptions<T>) {
   const query = useQuery<T>(
      "themes/questions",
      () => defaultHttpRequest("themes/questions", "GET"),
      options
   );

   return defaultErrorHandler(query);
}

export function useThemesMutation<T extends ThemeParams>(
   options: UseMutationOptions<void, RequestError, T> = {},
   extraOptions?: MutationExtraOptions
) {
   let newOptions = defaultOptionsForMutations({
      queriesToInvalidate: ["user"],
      extraOptions,
      options
   });

   return useMutation<void, RequestError, T, unknown>(
      data => defaultHttpRequest(data.action, "POST", data),
      newOptions
   );
}

export interface ThemeParams extends BasicThemeParams {
   action: ThemeEditAction;
}

export enum ThemeEditAction {
   Subscribe = "themes/subscribe",
   Block = "themes/block",
   RemoveSubscription = "themes/subscribe/remove",
   RemoveBlock = "themes/block/remove"
}
