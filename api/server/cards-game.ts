import { UseQueryOptions, useQuery } from "react-query";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { defaultErrorHandler, defaultHttpRequest } from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import { User } from "./shared-tools/endpoints-interfaces/user";

export function useCardsRecommendations<T extends User[]>(
   requestParams?: TokenParameter,
   options?: UseQueryOptions<T>
) {
   const { token } = useFacebookToken(requestParams?.token);

   const query = useQuery<T>(
      "cards-game/recommendations",
      () => defaultHttpRequest("cards-game/recommendations", "GET", { token }),
      {
         ...options,
         ...(!token ? { enabled: false } : {})
      }
   );

   return defaultErrorHandler(query);
}

export function useCardsDisliked<T extends User[]>(
   requestParams?: TokenParameter,
   options?: UseQueryOptions<T>
) {
   const { token } = useFacebookToken(requestParams?.token);

   const query = useQuery<T>(
      "cards-game/disliked-users",
      () => defaultHttpRequest("cards-game/disliked-users", "GET", { token }),
      {
         ...options,
         ...(!token ? { enabled: false } : {})
      }
   );

   return defaultErrorHandler(query);
}
