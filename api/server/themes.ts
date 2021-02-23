import { revalidate, useCache, UseCacheOptions } from "./../tools/useCache";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { defaultHttpRequest } from "../tools/httpRequest";
import {
   BasicThemeParams,
   Theme,
   ThemeGetParams,
   ThemesAsQuestion
} from "./shared-tools/endpoints-interfaces/themes";

export function useThemes<T extends Theme[]>(props?: {
   requestParams?: ThemeGetParams;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useFacebookToken(props?.requestParams?.token);

   return useCache<T>(
      "themes",
      () => defaultHttpRequest("themes", "GET", { ...(props?.requestParams ?? {}), token }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export function useThemesAsQuestions<T extends ThemesAsQuestion[]>(props?: {
   config?: UseCacheOptions<T>;
}) {
   return useCache<T>(
      "themes/questions",
      () => defaultHttpRequest("themes/questions", "GET"),
      props?.config
   );
}

export async function sendThemes(params: ThemeParams, autoRevalidateRelated: boolean = true) {
   const resp = await defaultHttpRequest(params.action, "POST", params, { handleErrors: true });
   if (autoRevalidateRelated) {
      revalidate("user");
   }
   return resp;
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
