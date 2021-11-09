import { useModal } from "react-native-modalfy";
import { EmailLoginModalProps } from "../EmailLoginModal";

export function useEmailLoginModal() {
   const { openModal, closeModal } = useModal();

   const openEmailLoginModal = (props: EmailLoginModalProps) => {
      openModal("EmailLoginModal", props);
   };

   return { openEmailLoginModal, closeEmailLoginModal: closeModal };
}
