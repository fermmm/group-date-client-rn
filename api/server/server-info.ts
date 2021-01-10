import { ServerInfoResponse } from "./shared-tools/endpoints-interfaces/server-info";
import { useQuery, UseQueryOptions } from "react-query";
import Constants from "expo-constants";
import { defaultHttpRequest, defaultErrorHandler } from "../tools/reactQueryTools";

/**
 * This request sends the version of the client to the server and gets information about possible updates
 * needed in the client, service status and other important information.
 */
export function useServerInfo<T = ServerInfoResponse>(options?: UseQueryOptions<T>) {
   const response = useQuery<T>(
      "server-info",
      () => defaultHttpRequest("server-info", "GET", { version: Constants.manifest.version }),
      options
   );
   return defaultErrorHandler(response);
}
