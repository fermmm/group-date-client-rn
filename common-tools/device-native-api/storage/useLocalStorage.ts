import { revalidate, useCache } from "./../../../api/tools/useCache";
import { useCallback } from "react";
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
   const { data: stored, isLoading } = useCache<{ value: T }>(key, async () => {
      return { value: await loadFromDevice(key, settings) };
   });

   const refresh = useCallback(() => {
      revalidate(key);
   }, [key]);

   const setValue = useCallback(
      async (value: T, reRender?: boolean) => {
         await saveOnDevice(key, value, settings);
         if (reRender) {
            refresh();
         }
      },
      [key, settings?.secure]
   );

   return {
      isLoading,
      value: stored?.value,
      setValue,
      refresh
   };
}

export interface UseLocalStorage<T> {
   isLoading: boolean;
   value: T;
   setValue: (newValue: T, reRender?: boolean) => Promise<void>;
   refresh: () => void;
}
