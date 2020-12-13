import { QueryConfig, useQuery } from "react-query";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import { ProfileStatusServerResponse } from "./shared-tools/endpoints-interfaces/user";

export function useServerProfileStatus<T = ProfileStatusServerResponse>(
   requestParams?: TokenParameter,
   config?: QueryConfig<T>
) {
   const storedToken = useFacebookToken();
   const { token } = requestParams ?? storedToken;
   const extraConfig: QueryConfig<T> = token == null ? { enabled: false } : {};

   const query = useQuery<T>(["user/profile-status", "GET", { token }], defaultRequestFunction, {
      ...config,
      ...extraConfig
   });

   return defaultErrorHandler(query);
}
