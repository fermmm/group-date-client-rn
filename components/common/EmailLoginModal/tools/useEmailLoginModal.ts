import { useModal } from "react-native-modalfy";
import { EmailLoginModalProps } from "../EmailLoginModal";

// To edit the contents of the email login modal open the file EmailLoginModal.tsx
export function useEmailLoginModal() {
   const { openModal, closeModal } = useModal();

   const openEmailLoginModal = (props: EmailLoginModalProps) => {
      openModal("EmailLoginModal", props);
   };

   return { openEmailLoginModal, closeEmailLoginModal: closeModal };
}
