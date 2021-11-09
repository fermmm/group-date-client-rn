import { useModal } from "react-native-modalfy";
import { DialogModalProps } from "../DialogModal";

export function useDialogModal() {
   const { openModal, closeModal } = useModal();

   const openDialogModal = (props: DialogModalProps) => {
      openModal("DialogModal", props);
   };

   return { openDialogModal, closeDialogModal: closeModal };
}
