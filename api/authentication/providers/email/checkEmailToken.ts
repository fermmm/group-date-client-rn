import { emailLoginGet } from "../../../server/email-login";

export async function checkEmailToken(extendedToken: string) {
   const response = await emailLoginGet(
      { token: extendedToken },
      { handleErrors: true, silentErrors: true }
   );

   return { valid: response?.userExists === true };
}
