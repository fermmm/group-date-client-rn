import { FC } from "react";
import { FetcherFn, UseCache, UseCacheOptions } from "../useCache";

export function useCacheRq<Response = void, Error = any>(
   key: string,
   fn?: FetcherFn<Response>,
   config?: UseCacheOptions<Error>
): UseCache<Response, Error> {
   return null;
}

/**
 * Pass one or multiple keys and the requests for these keys are going to be made again to update the cache data
 */
export async function revalidateRq<T>(key: string | string[]) {}

/**
 * Writes the cache data locally. Useful when you have updated data from another request and want to update
 * all caches that contains the same object without making more unnecessary requests.
 */
export async function mutateCacheRq<T>(key: string, newData: T) {
   // TODO: In React query this is queryClient.setQueryData
   return null;
}

export const ConfigProviderRq: FC = ({ children }) => {
   return null;
};
