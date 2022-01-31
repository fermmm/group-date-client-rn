import { useModal } from "../../GlobalModalsProvider/tools/useModal";
import AdultConfirmModal, { PropsAdultConfirmModal } from "../AdultConfirmModal";

export function useAdultConfirmDialog() {
   const { openModal, closeModal } = useModal(AdultConfirmModal);

   const openAdultConfirmDialog = (modalProps: PropsAdultConfirmModal) => {
      openModal({ modalProps });
   };

   return { openAdultConfirmDialog, closeAdultConfirmDialog: closeModal };
}
