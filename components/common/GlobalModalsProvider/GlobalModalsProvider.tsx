import React, { createContext, FC, useState } from "react";

export const GlobalModalsContext = createContext([]);

export interface NewModalProps<T = {}> {
   modalId: string;
   modalComponent: React.FC<T & ModalRequiredProps>;
   props?: T;
}

export interface ModalRequiredProps {
   /** Call this inside the modal to close it */
   close?: () => void;
}

/**
 * This component needs to be placed at the root of the project. Not to be used as a normal component.
 */
const GlobalModalsProvider: FC = ({ children }) => {
   const state = useState<NewModalProps[]>([]);
   const [modals, setModals] = state;

   const closeModal = (modalId: string) => {
      setModals(modals.filter(modal => modal.modalId !== modalId));
   };

   return (
      <GlobalModalsContext.Provider value={state}>
         {children}
         {modals.map(modal => (
            <modal.modalComponent
               {...(modal.props ?? {})}
               close={() => closeModal(modal.modalId)}
            />
         ))}
      </GlobalModalsContext.Provider>
   );
};

export default GlobalModalsProvider;
