import { loadFromDevice } from "../../../../common-tools/device-native-api/storage/storage";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";
import { useEmailLoginModal } from "../../../../components/common/EmailLoginModal/tools/useEmailLoginModal";
import { emailLoginTokenGet } from "../../../server/email-login";

/**
 * This function returns the token using the email and password stored in the device.
 * To return the token a request to the server is done sending the email and password.
 */
export function useEmailToken() {
   const { openEmailLoginModal, closeEmailLoginModal } = useEmailLoginModal();

   const getEmailToken = async () => {
      let resolve: (value?: string | PromiseLike<string>) => void;
      let reject: (err?: Error) => void;

      const promise = new Promise<string>((res, rej) => {
         resolve = res;
         reject = rej;
      });

      openEmailLoginModal({
         onDismiss: () => resolve(null),
         onLogin: async () => {
            const email = await loadFromDevice(LocalStorageKey.EmailLoginUser);
            const password = await loadFromDevice(LocalStorageKey.EmailLoginPass);

            if (!email || !password) {
               resolve(null);
            }

            const response = await emailLoginTokenGet({ email, password });
            return resolve(response.token);
         }
      });

      return promise;
   };

   return getEmailToken;
}
