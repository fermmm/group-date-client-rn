import { useCallback, useEffect, useState } from "react";
import { loadFromDevice, loadFromDeviceSecure, saveOnDevice, saveOnDeviceSecure } from "./storage";

export function useLocalStorage(key: string, secure: boolean = true): UseLocalStorage {
   const [isLoading, setIsLoading] = useState(false);
   const [valueState, setValueState] = useState(null);

   const refresh = useCallback(() => {
      setIsLoading(true);
      let promise: Promise<string>;

      if (secure) {
         promise = loadFromDeviceSecure(key);
      } else {
         promise = loadFromDevice(key);
      }

      promise
         .then(v => {
            setValueState(v);
            setIsLoading(false);
         })
         .catch(() => {
            setIsLoading(false);
         });
   }, []);

   const setValue = useCallback((value: string) => {
      setIsLoading(true);

      let promise: Promise<void>;
      if (secure) {
         promise = saveOnDeviceSecure(key, value);
      } else {
         promise = saveOnDevice(key, value);
      }

      promise
         .then(() => {
            setIsLoading(false);
         })
         .catch(() => {
            setIsLoading(false);
         });
   }, []);

   useEffect(() => {
      refresh();
   }, []);

   return {
      isLoading,
      value: valueState,
      setValue,
      refresh
   };
}

export interface UseLocalStorage {
   isLoading: boolean;
   value: string;
   setValue: (newValue: string) => void;
   refresh: () => void;
}
