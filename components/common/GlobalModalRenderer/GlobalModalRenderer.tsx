import React, { FC } from "react";
import { useRecoilState } from "recoil";
import { atomGlobalModals } from "./tools/atoms";

/**
 * This component needs to be placed at the root of the project. Not to be used as a normal component.
 */
const GlobalModalRenderer: FC = () => {
   const [modals, setModals] = useRecoilState(atomGlobalModals);

   const closeModal = (modalId: string) => {
      setModals(modals.filter(modal => modal.modalId !== modalId));
   };

   return (
      <>
         {modals.map(modal => (
            <modal.modalComponent
               {...(modal.props ?? {})}
               close={() => closeModal(modal.modalId)}
            />
         ))}
      </>
   );
};

export default GlobalModalRenderer;
