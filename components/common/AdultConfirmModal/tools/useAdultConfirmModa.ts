import { useModal } from "../../GlobalModalsProvider/tools/useModal";
import AdultConfirmModal from "../AdultConfirmModal";

export function useAdultConfirmDialog() {
   const { openModal, closeModal } = useModal(AdultConfirmModal);
   return { openAdultConfirmDialog: openModal, closeAdultConfirmDialog: closeModal };
}
