import { QueryConfig, useQuery } from "react-query";
import {
   HandshakeParams,
   ServerHandshakeResponse
} from "./shared-tools/endpoints-interfaces/handshake";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";

export function useServerHandshake<T = ServerHandshakeResponse>(
   data: HandshakeParams,
   config?: QueryConfig<T>
) {
   const query = useQuery<T>(["handshake", "GET", data], defaultRequestFunction, config);
   return defaultErrorHandler(query);
}
