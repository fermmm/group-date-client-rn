import React, { FC } from "react";
import { AppState } from "react-native";
import {
   QueryClientProvider,
   QueryClient,
   focusManager,
   useQuery,
   UseQueryOptions
} from "react-query";
import { FetcherFn, UseCache, UseCacheOptions } from "../useCache";
import { addDefaultErrorHandling } from "./addDefaultErrorHandling";

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: Infinity,
         structuralSharing: false,
         retry: false,
         refetchOnWindowFocus: false
      }
   }
});

export function useCacheRq<Response = void, Error = any>(
   key: string,
   fn?: FetcherFn<Response>,
   config?: UseCacheOptions<Error>
): UseCache<Response, Error> {
   // Translate generic config props to React Query config props when the names are different
   const configRq: UseQueryOptions<Response, Error, Response> = {
      ...config,
      refetchInterval: config?.refreshInterval,
      refetchOnMount: config?.revalidateOnMount
   };

   let query = useQuery<Response, Error>(key, fn, configRq);

   // Translate generic return props to React Query when the names are different
   const result = {
      key,
      isLoading: query.isLoading,
      isEnabled: config?.enabled ?? true,
      data: query.data,
      error: query.error as Error,
      revalidate: async () => {
         await query.refetch();
      },
      isValidating: query.isFetching
   };

   return addDefaultErrorHandling(result);
}

export async function revalidateRq<T>(key: string | string[]) {
   if (Array.isArray(key)) {
      key.forEach(query => queryClient.invalidateQueries(query));
   } else {
      queryClient.invalidateQueries(key);
   }
}

export async function mutateCacheRq<T>(key: string, newData: T) {
   return queryClient.setQueryData<T>(key, newData);
}

export const ConfigProviderRq: FC = ({ children }) => {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

/**
 * This replaces the default focus manager (browser compatible) with a react native focus manager
 */
export function initFocusManagerRq() {
   focusManager.setEventListener(setFocus => {
      const handleAppStateChange = appState => {
         if (appState === "active") {
            setFocus();
         }
      };

      AppState.addEventListener("change", handleAppStateChange);

      return () => {
         AppState.removeEventListener("change", handleAppStateChange);
      };
   });
}
