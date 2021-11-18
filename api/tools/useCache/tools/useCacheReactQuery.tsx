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
import { useDefaultErrorHandling } from "./useDefaultErrorHandling";

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: Infinity,
         structuralSharing: false,
         retry: false,
         refetchOnWindowFocus: false,
         refetchOnMount: false,
         retryOnMount: false
      }
   }
});

export function useCacheRq<Response = void, Error = any>(
   key: string,
   fn?: FetcherFn<Response>,
   config?: UseCacheOptions<Response, Error>
): UseCache<Response, Error> {
   // Translate generic config props to React Query config props when the names are different
   const configRq: UseQueryOptions<Response, Error, Response> = {
      ...config,
      refetchInterval: config?.refreshInterval,
      refetchOnMount: config?.revalidateOnMount
   };
   const { showAlertOnError = true } = config ?? {};

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

   return useDefaultErrorHandling(result, { showAlertOnError });
}

export async function revalidateRq<T>(key: string | string[], settings?: { exactMatch?: boolean }) {
   if (Array.isArray(key)) {
      for (const query of key) {
         await queryClient.invalidateQueries(query);
      }
   } else {
      if (settings?.exactMatch === true) {
         await queryClient.invalidateQueries(key);
      } else {
         /**
          * Matching a query that starts with a string is not implemented in React Query, the
          * documentation seems to suggest that it is, but it seems that only works with
          * array type of keys. This is good because for example you want to update the "user"
          * key and by mistake you will update all "user/...". Although here is an implementation
          * of partial matching that can be disabled with exactMatch setting. This is not a good
          * feature and it's a good idea to remove it in the future and use array keys instead.
          */
         await queryClient.invalidateQueries({
            predicate: query => {
               if (!Array.isArray(query.queryKey)) {
                  if (((query.queryKey as string) ?? "").startsWith(key)) {
                     return true;
                  }
               } else {
                  if ((query.queryKey[0] ?? "").startsWith(key)) {
                     return true;
                  }
               }
               return false;
            }
         });
      }
   }
}

export async function mutateCacheRq<T>(key: string, newData: T) {
   return queryClient.setQueryData<T>(key, newData);
}

export async function deleteAllCacheRq() {
   return queryClient.clear();
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
