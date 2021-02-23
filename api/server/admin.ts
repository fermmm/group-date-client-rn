import { defaultHttpRequest } from "../tools/httpRequest";
import { revalidate, UseCacheOptions, useCache } from "../tools/useCache";
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

export async function sendForceGroupsSearch(autoRevalidateRelated: boolean = true) {
   const resp = await defaultHttpRequest<void, string>("testing/force-groups-search", "GET", null, {
      handleErrors: true
   });
   if (autoRevalidateRelated) {
      revalidate("user/groups");
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
