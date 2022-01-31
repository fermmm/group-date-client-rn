import { useContext, useMemo } from "react";
import { GlobalModalsContext, ModalRequiredProps } from "../GlobalModalsProvider";

export function useModal<T = {}>(modalComponent: React.FC<T & ModalRequiredProps>) {
   const [modals, setModals] = useContext(GlobalModalsContext);
   const modalId = useMemo(() => String(Math.random()), []);

   const openModal = (modalProps?: T) => {
      const isAlreadyOpen = modals.find(d => d.modalId === modalId) !== undefined;

      if (isAlreadyOpen) {
         return;
      }

      setModals(modals => [...modals, { modalComponent, modalId, props: modalProps }]);
   };

   const closeModal = () => {
      setModals(dialogs => dialogs.filter(modal => modal.modalId !== modalId));
   };

   return { openModal, closeModal };
}
