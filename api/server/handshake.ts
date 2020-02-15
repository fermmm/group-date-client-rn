import Constants from "expo-constants";
import { httpRequest } from "../tools/httpRequest";
import { ServerHandshakeResponse } from "../typings/endpoints-interfaces";

export async function serverHandshake(): Promise<void> {
   console.log(Constants.manifest.version);
   const response: ServerHandshakeResponse = await httpRequest({
      url: "handshake"
   });
}
