import React, { FC } from "react";
import { LogBox } from "react-native";
import {
   ConfigProviderRq,
   deleteAllCacheRq,
   initFocusManagerRq,
   mutateCacheRq,
   revalidateRq,
   useCacheRq
} from "./tools/useCacheReactQuery";

export enum CacheLibrary {
   ReactQuery,
   Swr // TODO: Remove this and refactor to use ReactQuery
}

let cacheLibraryToUse: CacheLibrary = CacheLibrary.ReactQuery;

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
   config?: UseCacheOptions<Response, Error>
): UseCache<Response, Error> {
   return useCacheRq(key, fn, config);
}

/**
 * Pass one or multiple keys and the requests for these keys are going to be made again to update the cache data
 */
export async function revalidate<T>(key: string | string[], settings?: { exactMatch?: boolean }) {
   await revalidateRq(key, settings);
}

/**
 * Writes the cache data locally. Useful when you have updated data from another request and want to update
 * all caches that contains the same object without making more unnecessary requests.
 */
export async function mutateCache<T>(key: string, newData: T) {
   await mutateCacheRq(key, newData);
}

export async function deleteAllCache() {
   await deleteAllCacheRq();
}

export const CacheConfigProvider: FC = ({ children }) => {
   return <ConfigProviderRq>{children}</ConfigProviderRq>;
};

if (cacheLibraryToUse === CacheLibrary.ReactQuery) {
   initFocusManagerRq();
}

export declare type FetcherFn<Data> = ((...args: any) => Data | Promise<Data>) | null;

export interface UseCacheOptions<Response = void, Error = any> {
   enabled?: boolean;
   refreshInterval?: number;
   revalidateOnMount?: boolean;
   onSuccess?: (data: Response) => void;
   onError?: (err: Error) => void;
   onErrorRetry?: (err: Error) => void;
   showAlertOnError?: boolean;
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
