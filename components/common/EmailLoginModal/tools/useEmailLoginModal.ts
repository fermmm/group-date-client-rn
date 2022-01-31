import { useModal } from "../../GlobalModalsProvider/tools/useModal";
import EmailLoginModal from "../EmailLoginModal";

export function useEmailLoginModal() {
   const { openModal, closeModal } = useModal(EmailLoginModal);
   return { openEmailLoginModal: openModal, closeEmailLoginModal: closeModal };
}
