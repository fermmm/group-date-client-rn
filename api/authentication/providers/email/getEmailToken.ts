import { useEmailLoginModal } from "../../../../components/common/EmailLoginModal/tools/useEmailLoginModal";

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
         onLogin: async (token: string) => {
            resolve(token);
         }
      });

      return promise;
   };

   return getEmailToken;
}
