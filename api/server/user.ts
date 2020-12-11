import { QueryConfig, useQuery } from "react-query";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import { ProfileStatusServerResponse } from "./shared-tools/endpoints-interfaces/user";

export function useServerProfileStatus<T = ProfileStatusServerResponse>(
   data: TokenParameter,
   config?: QueryConfig<T>
) {
   const query = useQuery<T>(["user/profile-status", "GET", data], defaultRequestFunction, config);
   return defaultErrorHandler(query);
}
