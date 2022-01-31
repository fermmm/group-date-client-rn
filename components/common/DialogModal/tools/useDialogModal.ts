import { useModal } from "../../GlobalModalsProvider/tools/useModal";
import DialogModal from "../DialogModal";

export function useDialogModal() {
   const { openModal, closeModal } = useModal(DialogModal);
   return { openDialogModal: openModal, closeDialogModal: closeModal };
}
