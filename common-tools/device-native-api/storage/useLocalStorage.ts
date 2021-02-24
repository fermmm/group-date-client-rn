import { useCallback, useEffect, useState } from "react";
import { loadFromDevice, saveOnDevice } from "./storage";

/**
 * Hook to manage local storage. Warning: when calling setValue changes are saved but there is no re-render
 * and the value is the same unless refresh() is called. After refresh is called there is always a re-render
 * because the reference changes even if the data is the same, in other words there is no deep equality check.
 */
export function useLocalStorage<T>(
   key: string,
   settings?: { secure: boolean }
): UseLocalStorage<T> {
   const [isLoading, setIsLoading] = useState(true);
   const [valueState, setValueState] = useState<T>(null);

   const refresh = useCallback(() => {
      setIsLoading(true);
      const promise: Promise<T> = loadFromDevice(key, settings);

      promise
         .then(v => {
            setValueState(v);
            setIsLoading(false);
         })
         .catch(() => {
            setIsLoading(false);
         });
   }, [settings?.secure]);

   const setValue = useCallback(
      async (value: T) => {
         setIsLoading(true);
         await saveOnDevice(key, value, settings);
         setIsLoading(false);
      },
      [settings?.secure]
   );

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

export interface UseLocalStorage<T> {
   isLoading: boolean;
   value: T;
   setValue: (newValue: T) => Promise<void>;
   refresh: () => void;
}
