import React, { FC, useEffect, useRef } from "react";
import useSWR, { ConfigInterface, keyInterface, mutate, responseInterface, SWRConfig } from "swr";
import { fetcherFn } from "swr/dist/types";
import { UseCache, UseCacheOptions } from "../useCache";
import { useDefaultErrorHandling } from "./useDefaultErrorHandling";

export const swrGlobalConfig: ConfigInterface = {
   refreshInterval: 0,
   errorRetryCount: 1,
   shouldRetryOnError: false,
   revalidateOnMount: false,
   revalidateOnFocus: false,
   revalidateOnReconnect: false,
   compare: (a, b) => a === b
};

export function useCacheSwr<Response = void, Error = any>(
   key: string,
   fn?: fetcherFn<Response>,
   config?: UseCacheOptions<Error>
): UseCache<Response, Error> {
   const newKey = key && config?.enabled !== false ? key : null;
   const prevKey = useRef(newKey);
   let swr = useSWR<Response>(newKey, fn, config);
   const data = useAvoidNull(swr.data);
   swr = { ...swr, data: data };

   // Workaround for this swr bug: https://github.com/vercel/swr/issues/455
   useEffect(() => {
      if (
         newKey != null &&
         !swr.data &&
         !swr.error &&
         !swr.isValidating &&
         !config?.revalidateOnMount
      ) {
         swr.mutate();
      }
   }, [swr.data, swr.error, swr.isValidating, swr.mutate, newKey]);

   // This is also for the same workaround. If key is different also mutate() otherwise a key change returns the same cache
   useEffect(() => {
      if (newKey !== prevKey.current) {
         swr.mutate();
      }
      prevKey.current = newKey;
   }, [newKey]);

   let result: UseCache<Response, Error> = {
      ...swr,
      key,
      isEnabled: newKey != null,
      isLoading: (swr.data == null || swr.isValidating) && !swr.error && newKey != null
   };

   result = useDefaultErrorHandling(result);

   return result;
}

export async function revalidateSwr<T>(key: keyInterface | keyInterface[]) {
   if (Array.isArray(key)) {
      for (const k of key) {
         await mutate(k, null, true);
      }
   } else {
      await mutate(key, null, true);
   }
}

// In React query this is queryClient.setQueryData
export async function mutateCacheSwr<T>(key: keyInterface, newData: T) {
   await mutate(key, newData, false);
}

/**
 * When revalidating something SWR always sets data as null so you show a loading screen.
 * Instead of a loading screen it's better to show old information if there is available.
 * So this hook keeps the old data available in a ref and returns that when data == null
 */
function useAvoidNull<T>(data: T): T {
   const backup = useRef<T>();
   if (data != null) {
      backup.current = data;
   }
   return backup.current;
}

export const ConfigProviderSwr: FC = ({ children }) => {
   return <SWRConfig value={swrGlobalConfig}>{children}</SWRConfig>;
};
