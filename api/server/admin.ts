import { defaultHttpRequest } from "../tools/httpRequest";
import { revalidate, UseCacheOptions, useCache } from "../tools/useCache/useCache";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";

export async function sendCreateFakeUsers(
   params: TokenParameter & { text: string },
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest<typeof params, string>(
      "testing/create-fake-users",
      "GET",
      params,
      { handleErrors: true }
   );
   if (autoRevalidateRelated) {
      revalidate("cards-game/recommendations");
   }
   return resp;
}

export async function sendForceGroupsSearch(
   params: TokenParameter,
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest<typeof params, string>(
      "testing/force-groups-search",
      "GET",
      params,
      {
         handleErrors: true
      }
   );
   if (autoRevalidateRelated) {
      revalidate("user/notifications");
   }
   return resp;
}

export async function sendCreateFakeTags(
   params: TokenParameter & { text: string },
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest<typeof params, string>(
      "testing/create-fake-tags",
      "GET",
      params,
      { handleErrors: true }
   );
   if (autoRevalidateRelated) {
      revalidate("tags");
   }
   return resp;
}

export async function sendCreateFakeChat(
   params: TokenParameter,
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest<typeof params, string>(
      "testing/create-fake-chat",
      "GET",
      params,
      { handleErrors: true }
   );
   if (autoRevalidateRelated) {
   }
   return resp;
}

export function useTemp<T extends string>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   return useCache<T>("testing/temp", () => defaultHttpRequest("testing/temp", "GET"), {
      ...(props?.config ?? {})
   });
}
