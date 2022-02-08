import { useContext, useEffect, useState } from "react";
import { GlobalModalsContext, ModalRequiredProps } from "../GlobalModalsProvider";

export function useModal<T = {}>(modalComponent: React.FC<T & ModalRequiredProps>): UseModal<T> {
   const [modals, setModals] = useContext(GlobalModalsContext);
   const [modalIds, setModalIds] = useState<string[]>([]);

   // Effect to update the local modal Ids array to only contain existing modals
   useEffect(() => {
      // Only keep the modal ids that are present in the global list of open modals
      setModalIds(modalIds =>
         modalIds.filter(modalId => modals.find(modal => modal.modalId === modalId) !== undefined)
      );
   }, [modals]);

   const openModal = (modalProps?: T) => {
      const modalId = String(Math.random());

      setModalIds(modalIds => [...modalIds, modalId]);
      setModals(modals => [...modals, { modalComponent, modalId, props: modalProps }]);

      return modalId;
   };

   const closeModal = (modalId?: string) => {
      if (modalId === undefined) {
         if (modalIds.length === 0) {
            return;
         }

         modalId = modalIds[modalIds.length - 1];
      }

      setModals(dialogs => dialogs.filter(modal => modal.modalId !== modalId));
   };

   return { openModal, closeModal };
}

interface UseModal<T = {}> {
   /**
    * Opens a modal and returns the modalId to close it later. You can close it
    * without the modalId if you just want to close the last one.
    */
   openModal: (modalProps?: T) => string;

   /**
    * Closes the last modal opened with openModal() of the same useModal instance.
    * If you want to close a specific modal. If you pass the modalId you can even
    * close a modal from another useModal instance, even from another component.
    */
   closeModal: (modalId: string) => void;
}
