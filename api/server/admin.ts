import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import {
   defaultHttpRequest,
   defaultOptionsForMutations,
   RequestError,
   MutationExtraOptions
} from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";

export function useTestEndpoint2Mutation<
   T extends TokenParameter & { text: string },
   R extends string
>(options: UseMutationOptions<R, RequestError, T> = {}, extraOptions?: MutationExtraOptions) {
   let newOptions = defaultOptionsForMutations({
      extraOptions,
      options,
      queriesToInvalidate: ["cards-game/recommendations"]
   });
   return useMutation(data => defaultHttpRequest("createFakeUsers", "GET", data), newOptions);
}
