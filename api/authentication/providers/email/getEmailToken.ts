import { loadFromDevice } from "../../../../common-tools/device-native-api/storage/storage";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";
import { emailLoginTokenGet } from "../../../server/email-login";

/**
 * This function returns the token using the email and password stored in the device.
 * To return the token a request to the server is done sending the email and password.
 */
export async function getEmailToken(): Promise<string | null> {
   const email = await loadFromDevice(LocalStorageKey.EmailLoginUser);
   const password = await loadFromDevice(LocalStorageKey.EmailLoginPass);

   if (!email || !password) {
      return null;
   }

   const response = await emailLoginTokenGet({ email, password });
   return response.token;
}
