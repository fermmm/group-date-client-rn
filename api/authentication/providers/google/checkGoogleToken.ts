import { httpRequest } from "../../../tools/httpRequest";

export async function checkGoogleToken(token: string) {
   const response: { email: string } = await httpRequest({
      baseURL: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      errorResponseSilent: true,
      handleErrors: true
   });

   return { valid: response?.email != null };
}
