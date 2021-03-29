import { ServerInfoResponse } from "./shared-tools/endpoints-interfaces/server-info";
import Constants from "expo-constants";
import { defaultHttpRequest } from "../tools/httpRequest";
import { useCache, UseCacheOptions } from "../tools/useCache/useCache";

/**
 * This request sends the version of the client to the server and gets information about possible updates
 * needed in the client, service status and other important information.
 */
export function useServerInfo<T extends ServerInfoResponse>(props?: {
   config?: UseCacheOptions<T>;
}) {
   return useCache<T>(
      "server-info",
      () => defaultHttpRequest("server-info", "GET", { version: Constants.manifest.version }),
      props?.config
   );
}
