import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { atomGlobalModals, ModalRequiredProps } from "./atoms";

export function useModal<T = {}>(modalComponent: React.FC<T & ModalRequiredProps>) {
   const [modals, setModals] = useRecoilState(atomGlobalModals);
   const modalId = useMemo(() => String(Math.random()), []);

   const openModal = <T = {}>(params?: { modalProps?: T }) => {
      const { modalProps = {} } = params ?? {};

      const isAlreadyOpen = modals.find(d => d.modalId === modalId) !== undefined;

      if (isAlreadyOpen) {
         return;
      }

      setModals([...modals, { modalComponent, modalId, props: modalProps }]);
   };

   const closeModal = () => {
      setModals(dialogs => dialogs.filter(modal => modal.modalId !== modalId));
   };

   return { openModal, closeModal };
}
