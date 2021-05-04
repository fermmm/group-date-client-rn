import { revalidate, useCache, UseCacheOptions } from "../tools/useCache/useCache";
import { useAuthentication } from "../authentication/useAuthentication";
import { defaultHttpRequest } from "../tools/httpRequest";
import {
   BasicTagParams,
   Tag,
   TagCreateParams,
   TagGetParams,
   TagsAsQuestion
} from "./shared-tools/endpoints-interfaces/tags";
import { showNativeFeedbackMessage } from "../../common-tools/device-native-api/native-ui/nativeFeedbackMessage";

export function useTags<T extends Tag[]>(props?: {
   requestParams?: TagGetParams;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);

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

export async function createTag(
   params: TagCreateParams,
   settings?: { autoRevalidateRelated?: boolean; feedbackText?: string }
) {
   const { autoRevalidateRelated = true, feedbackText } = settings ?? {};

   const resp = await defaultHttpRequest<TagCreateParams, Tag>("tags/create", "POST", params, {
      handleErrors: true
   });

   if (autoRevalidateRelated) {
      revalidate("tags");
   }

   if (settings?.feedbackText) {
      showNativeFeedbackMessage(settings?.feedbackText);
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
