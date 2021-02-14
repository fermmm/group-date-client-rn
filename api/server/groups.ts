import { revalidate, useCache } from "./../tools/useCache";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { defaultHttpRequest } from "../tools/httpRequest";
import { UseCacheOptions } from "../tools/useCache";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import {
   BasicGroupParams,
   DateIdeaVotePostParams,
   DayOptionsVotePostParams,
   Group
} from "./shared-tools/endpoints-interfaces/groups";

export function useUserGroupList<T extends Group[]>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useFacebookToken(props?.requestParams?.token);

   return useCache<T>("user/groups", () => defaultHttpRequest("user/groups", "GET", { token }), {
      ...(props?.config ?? {}),
      enabled: token != null && props?.config?.enabled !== false
   });
}

export function useGroup<T extends Group>(props?: {
   groupId: string;
   token?: string;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useFacebookToken(props?.token);

   return useCache<T>(
      "group" + (props?.groupId ?? ""),
      () =>
         defaultHttpRequest<BasicGroupParams, T>("group", "GET", {
            token,
            groupId: props.groupId
         }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.groupId != null && props?.config?.enabled !== false
      }
   );
}

export async function sendDayVotes(
   params: DayOptionsVotePostParams,
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest("group/days/vote", "POST", params);
   if (autoRevalidateRelated) {
      revalidate("group" + params.groupId);
   }
   return resp;
}

export async function sendIdeasVotes(
   params: DateIdeaVotePostParams,
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest("group/ideas/vote", "POST", params);
   if (autoRevalidateRelated) {
      revalidate("group" + params.groupId);
   }
   return resp;
}
