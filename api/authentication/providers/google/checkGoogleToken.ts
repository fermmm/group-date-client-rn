import { getTokenInfo } from "../../../server/shared-tools/authentication/tokenStringTools";
import { httpRequest } from "../../../tools/httpRequest";

export async function checkGoogleToken(extendedToken: string) {
   const { originalToken } = getTokenInfo(extendedToken);
   console.log("09");
   const response: { email: string } = await httpRequest({
      baseURL: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${originalToken}`,
      errorResponseSilent: true,
      handleErrors: true
   });
   console.log("10");
   return { valid: response?.email != null };
}
