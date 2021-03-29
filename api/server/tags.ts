import { revalidate, useCache, UseCacheOptions } from "../tools/useCache/useCache";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { defaultHttpRequest } from "../tools/httpRequest";
import {
   BasicTagParams,
   Tag,
   TagGetParams,
   TagsAsQuestion
} from "./shared-tools/endpoints-interfaces/tags";

export function useTags<T extends Tag[]>(props?: {
   requestParams?: TagGetParams;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useFacebookToken(props?.requestParams?.token);

   return useCache<T>(
      "tags",
      () => defaultHttpRequest("tags", "GET", { ...(props?.requestParams ?? {}), token }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export function useTagsAsQuestions<T extends TagsAsQuestion[]>(props?: {
   config?: UseCacheOptions<T>;
}) {
   return useCache<T>(
      "tags/questions",
      () => defaultHttpRequest("tags/questions", "GET"),
      props?.config
   );
}

export async function sendTags(params: TagParams, autoRevalidateRelated: boolean = true) {
   const resp = await defaultHttpRequest(params.action, "POST", params, { handleErrors: true });
   if (autoRevalidateRelated) {
      revalidate("user");
   }
   return resp;
}

export interface TagParams extends BasicTagParams {
   action: TagEditAction;
}

export enum TagEditAction {
   Subscribe = "tags/subscribe",
   Block = "tags/block",
   RemoveSubscription = "tags/subscribe/remove",
   RemoveBlock = "tags/block/remove"
}
