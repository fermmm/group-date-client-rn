import { QueryConfig, useQuery } from "react-query";
import {
   HandshakeParams,
   ServerHandshakeResponse
} from "./shared-tools/endpoints-interfaces/handshake";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";

export function useServerHandshake<T = ServerHandshakeResponse>(
   requestParams: HandshakeParams,
   config?: QueryConfig<T>
) {
   const response = useQuery<T>(
      ["handshake", "GET", requestParams],
      defaultRequestFunction,
      config
   );
   return defaultErrorHandler(response);
}
