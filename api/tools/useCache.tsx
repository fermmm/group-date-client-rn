import I18n from "i18n-js";
import React, { FC, useEffect, useRef, useState } from "react";
import { Alert, LogBox } from "react-native";
import useSWR, { ConfigInterface, keyInterface, mutate, responseInterface, SWRConfig } from "swr";
import { fetcherFn } from "swr/dist/types";
import { tryToGetErrorMessage } from "./httpRequest";

LogBox.ignoreLogs(["Setting a timer for"]);

export const swrGlobalConfig: ConfigInterface = {
   refreshInterval: 0,
   errorRetryCount: 1,
   shouldRetryOnError: false,
   revalidateOnMount: false,
   revalidateOnFocus: false,
   revalidateOnReconnect: false,
   compare: (a, b) => a === b
};

export function useCache<Response = void, Error = any>(
   key: keyInterface,
   fn?: fetcherFn<Response>,
   config?: UseCacheOptions<Response, Error>
): UseCache<Response, Error> {
   const newKey = key && config?.enabled !== false ? key : null;
   const prevKey = useRef(newKey);
   let swr = useSWR<Response>(newKey, fn, config);
   swr = defaultErrorHandler(swr);
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

   return {
      ...swr,
      key,
      isEnabled: newKey != null,
      isLoading: (swr.data == null || swr.isValidating) && !swr.error && newKey != null
   };
}

export async function revalidate<T>(key: keyInterface | keyInterface[]) {
   if (Array.isArray(key)) {
      for (const k of key) {
         await mutate(k, null, true);
      }
   } else {
      await mutate(key, null, true);
   }
}

export async function mutateCache<T>(key: keyInterface, newData: T) {
   await mutate(key, newData, false);
}

export const CacheConfigProvider: FC = ({ children }) => {
   return <SWRConfig value={swrGlobalConfig}>{children}</SWRConfig>;
};

export function defaultErrorHandler<Response, Error extends RequestError>(
   queryResult: responseInterface<Response, Error>
): responseInterface<Response, Error> {
   if (queryResult.error == null) {
      return queryResult;
   }

   if (queryResult.error.response == null) {
      Alert.alert(
         "ಠ_ಠ",
         I18n.t("There seems to be a connection problem"),
         [
            {
               text: I18n.t("Try again"),
               onPress: async () => queryResult.revalidate()
            }
         ],
         { cancelable: __DEV__ }
      );
   } else {
      Alert.alert(
         I18n.t("Error"),
         tryToGetErrorMessage(queryResult.error),
         [
            {
               text: I18n.t("OK")
            }
         ],
         { cancelable: true }
      );
   }

   return queryResult;
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

export interface UseCacheOptions<Response, Error = any> extends ConfigInterface<Response, Error> {
   enabled?: boolean;
}

export interface UseCache<Response, Error> extends responseInterface<Response, Error> {
   key: keyInterface;
   isLoading: boolean;
   isEnabled: boolean;
}

export interface RequestError {
   message: string;
   response: any;
}
