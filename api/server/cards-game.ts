import { BasicSingleTagParams, BasicTagParams } from "./shared-tools/endpoints-interfaces/tags";
import { useAuthentication } from "../authentication/useAuthentication";
import { defaultHttpRequest } from "../tools/httpRequest";
import { useCache, UseCacheOptions } from "../tools/useCache/useCache";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import { User } from "./shared-tools/endpoints-interfaces/user";

export function useCardsRecommendations<T extends User[]>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);

   return useCache<T>(
      "cards-game/recommendations",
      () => defaultHttpRequest("cards-game/recommendations", "GET", { token }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export function useCardsFromTag<T extends User[]>(props?: {
   requestParams?: Partial<BasicSingleTagParams>;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);

   return useCache<T>(
      "cards-game/from-tag-" + props?.requestParams?.tagId,
      () => defaultHttpRequest("cards-game/from-tag", "GET", { ...props?.requestParams, token }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export function useCardsDisliked<T extends User[]>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);

   return useCache<T>(
      "cards-game/disliked-users",
      () => defaultHttpRequest("cards-game/disliked-users", "GET", { token }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}
