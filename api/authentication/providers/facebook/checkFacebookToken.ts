import { getTokenInfo } from "../../../server/shared-tools/authentication/tokenStringTools";
import { httpRequest } from "../../../tools/httpRequest";

export async function checkFacebookToken(extendedToken: string) {
   const { originalToken } = getTokenInfo(extendedToken);
   const response: { id: string; name: string } = await httpRequest({
      baseURL: `https://graph.facebook.com/me?access_token=${originalToken}`,
      errorResponseSilent: true,
      handleErrors: true
   });

   return { valid: response?.name != null };
}
