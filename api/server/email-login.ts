import { defaultHttpRequest } from "../tools/httpRequest";
import { useCache, UseCacheOptions } from "../tools/useCache/useCache";
import {
   CreateAccountParams,
   CreateAccountResponse,
   LoginGetParams,
   LoginResponse,
   ResetPasswordPostParams,
   ResetPasswordResponse,
   UserExistsGetParams,
   UserExistsResponse
} from "./shared-tools/endpoints-interfaces/email-login";

export function useEmailLogin<
   Params extends LoginGetParams,
   Response extends LoginResponse
>(props: { requestParams: Params; silentErrors?: boolean; config?: UseCacheOptions<Response> }) {
   const { requestParams, silentErrors, config } = props;

   return useCache(
      "email-login/login" + JSON.stringify(requestParams),
      () => emailLoginGet(props.requestParams, { silentErrors }),
      config ?? {}
   );
}

/**
 * @param options Silent errors should be enabled are useful when checking if the
 * user is created or not and disabled when checking the credentials the user entered.
 */
export async function emailLoginGet<Params extends LoginGetParams>(
   params: Params,
   options?: { silentErrors?: boolean; handleErrors?: boolean }
) {
   const { silentErrors = false, handleErrors } = options ?? {};

   return await defaultHttpRequest<Params, LoginResponse>("email-login/login", "GET", params, {
      errorResponseSilent: silentErrors,
      handleErrors
   });
}

export async function emailLoginCreateAccountPost<
   Params extends CreateAccountParams,
   Response extends CreateAccountResponse
>(params: Params) {
   return await defaultHttpRequest<Params, Response>("email-login/create-account", "POST", params);
}

export async function emailLoginResetPasswordPost<
   Params extends ResetPasswordPostParams,
   Response extends ResetPasswordResponse
>(params: Params) {
   return await defaultHttpRequest<Params, Response>("email-login/reset-password", "POST", params, {
      handleErrors: true
   });
}

export async function userExistsGet<Params extends UserExistsGetParams>(
   params: Params,
   options?: { silentErrors?: boolean; handleErrors?: boolean }
) {
   const { silentErrors = false, handleErrors } = options ?? {};

   return await defaultHttpRequest<Params, UserExistsResponse>(
      "email-login/user-exists",
      "GET",
      params,
      {
         errorResponseSilent: silentErrors,
         handleErrors
      }
   );
}
