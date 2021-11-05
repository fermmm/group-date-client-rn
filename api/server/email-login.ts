import { defaultHttpRequest } from "../tools/httpRequest";
import {
   LoginGetParams,
   LoginResponse,
   TokenGetParams,
   TokenGetResponse
} from "./shared-tools/endpoints-interfaces/email-login";

export async function emailLoginTokenGet<Params extends TokenGetParams>(params: Params) {
   return await defaultHttpRequest<Params, TokenGetResponse>(
      "email-login/get-token",
      "GET",
      params
   );
}

export async function emailLoginGet<Params extends LoginGetParams>(params: Params) {
   return await defaultHttpRequest<Params, LoginResponse>("email-login/login", "GET", params);
}
