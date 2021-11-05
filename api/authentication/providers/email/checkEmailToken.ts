import { emailLoginGet } from "../../../server/email-login";

export async function checkEmailToken(extendedToken: string) {
   const response = await emailLoginGet({ token: extendedToken });
   return { valid: response?.success === true };
}
