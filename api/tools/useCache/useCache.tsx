import React, { FC } from "react";
import { LogBox } from "react-native";
import {
   ConfigProviderRq,
   mutateCacheRq,
   revalidateRq,
   useCacheRq
} from "./tools/useCacheReactQuery";
import { ConfigProviderSwr, mutateCacheSwr, revalidateSwr, useCacheSwr } from "./tools/useCacheSwr";

export enum CacheLibrary {
   ReactQuery,
   Swr
}

const cacheLibraryToUse: CacheLibrary = CacheLibrary.Swr;

LogBox.ignoreLogs(["Setting a timer for"]);

/**
 * Runs a fetcher function (fetch, axios, etc) the first time the hook is called, the second time uses a
 * cache instead so the server receives less requests and the app responds faster. Also complicated global
 * state libraries are not required when using this tool.
 * Each request is associated with a key passed here as a parameter, later this key can be used to write
 * the cache, revalidate, debug, etc.
 */
export function useCache<Response = void, Error = any>(
   key: string,
   fn?: FetcherFn<Response>,
   config?: UseCacheOptions<Error>
): UseCache<Response, Error> {
   if (cacheLibraryToUse === CacheLibrary.Swr) {
      return useCacheSwr(key, fn, config);
   }

   if (cacheLibraryToUse === CacheLibrary.ReactQuery) {
      return useCacheRq(key, fn, config);
   }
}

/**
 * Pass one or multiple keys and the requests for these keys are going to be made again to update the cache data
 */
export async function revalidate<T>(key: string | string[]) {
   if (cacheLibraryToUse === CacheLibrary.Swr) {
      revalidateSwr(key);
   }

   if (cacheLibraryToUse === CacheLibrary.ReactQuery) {
      revalidateRq(key);
   }
}

/**
 * Writes the cache data locally. Useful when you have updated data from another request and want to update
 * all caches that contains the same object without making more unnecessary requests.
 */
export async function mutateCache<T>(key: string, newData: T) {
   if (cacheLibraryToUse === CacheLibrary.Swr) {
      await mutateCacheSwr(key, newData);
   }

   if (cacheLibraryToUse === CacheLibrary.ReactQuery) {
      await mutateCacheRq(key, newData);
   }
}

export const CacheConfigProvider: FC = ({ children }) => {
   if (cacheLibraryToUse === CacheLibrary.Swr) {
      return <ConfigProviderSwr>{children}</ConfigProviderSwr>;
   }

   if (cacheLibraryToUse === CacheLibrary.ReactQuery) {
      return <ConfigProviderRq>{children}</ConfigProviderRq>;
   }
};

export declare type FetcherFn<Data> = ((...args: any) => Data | Promise<Data>) | null;

export interface UseCacheOptions<Error = any> {
   enabled?: boolean;
   refreshInterval?: number;
   revalidateOnMount?: boolean;
   onError?: (err: Error) => void;
   onErrorRetry?: (err: Error) => void;
}

export interface UseCache<Response, Error> {
   key: string;
   isLoading: boolean;
   isEnabled: boolean;
   data?: Response;
   error?: Error;
   revalidate: () => Promise<void | boolean>;
   isValidating: boolean;
}

export interface RequestError {
   message: string;
   response: any;
}
