import { atom } from "recoil";

export const atomGlobalModals = atom<NewModalProps[]>({
   key: "atomGlobalModals", // Unique ID
   default: []
});

export interface NewModalProps<T = {}> {
   modalId: string;
   modalComponent: React.FC<T & ModalRequiredProps>;
   props?: T;
}

export interface ModalRequiredProps {
   /** Call this inside the modal to close it */
   close?: () => void;
}
