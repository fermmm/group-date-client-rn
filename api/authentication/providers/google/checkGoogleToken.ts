import { getTokenInfo } from "../../../server/shared-tools/authentication/tokenStringTools";
import { httpRequest } from "../../../tools/httpRequest";

export async function checkGoogleToken(extendedToken: string) {
   const { originalToken } = getTokenInfo(extendedToken);

   const response: { email: string } = await httpRequest({
      baseURL: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${originalToken}`,
      errorResponseSilent: true,
      handleErrors: true
   });

   return { valid: response?.email != null };
}
