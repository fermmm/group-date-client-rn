import React, { createContext, Dispatch, FC, SetStateAction, useState } from "react";

export const GlobalModalsContext =
   createContext<[NewModalProps[], Dispatch<SetStateAction<NewModalProps[]>>]>(null);

export interface NewModalProps<T = {}> {
   modalId: string;
   modalComponent: React.FC<T & ModalRequiredProps>;
   props?: T;
}

export interface ModalRequiredProps {
   /** Call this inside the modal to close it */
   close?: () => void;
}

const GlobalModalsProvider: FC = ({ children }) => {
   const state = useState<NewModalProps[]>([]);
   const [modals, setModals] = state;

   const closeModal = (modalId: string) => {
      setModals(modals => modals.filter(modal => modal.modalId !== modalId));
   };

   return (
      <GlobalModalsContext.Provider value={state}>
         {children}
         {modals.map(modal => (
            <modal.modalComponent
               {...(modal.props ?? {})}
               close={() => closeModal(modal.modalId)}
               key={modal.modalId}
            />
         ))}
      </GlobalModalsContext.Provider>
   );
};

export default GlobalModalsProvider;
