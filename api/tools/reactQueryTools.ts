import { Method } from "axios";
import Constants from "expo-constants";
import { SERVER_URL } from "@env";
import I18n from "i18n-js";
import { Alert, LogBox, AppState } from "react-native";
import { QueryClient, QueryObserverResult, UseMutationOptions, focusManager } from "react-query";
import { AxiosRequestConfigExtended, httpRequest, tryToGetErrorMessage } from "./httpRequest";

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: Infinity
      },
      mutations: {}
   }
});
LogBox.ignoreLogs(["Setting a timer"]);

/**
 * This replaces the default focus manager (browser compatible) with a react native focus manager
 */
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

export async function defaultHttpRequest<D = void, R = void>(
   url: string,
   method: Method,
   data?: D
): Promise<R> {
   const axiosObject: AxiosRequestConfigExtended = {
      headers: { "Accept-Language": I18n.locale },
      baseURL: prepareUrl(SERVER_URL),
      url,
      method
   };

   // Get requests does not support data object, only params
   if (method.toLowerCase() === "get") {
      axiosObject.params = data;
   } else {
      axiosObject.data = data;
   }

   return httpRequest<R>(axiosObject);
}

/**
 * Currently this function only replaces the localhost part of the url by the local address of the development
 * machine otherwise localhost will be the localhost of the phone and not the machine one, if the app is
 * executing in production there is no localhost part on the url so it remains unchanged.
 */
export function prepareUrl(url: string): string {
   if (url.includes("localhost")) {
      return url.replace("localhost", Constants.manifest.debuggerHost.split(`:`).shift());
   } else {
      return url;
   }
}

export function defaultErrorHandler<T>(
   queryResult: QueryObserverResult<T>
): QueryObserverResult<T> {
   if (!queryResult.isError) {
      return queryResult;
   }
   const error = (queryResult as QueryObserverResult<T, RequestError>).error;
   if (error.response == null) {
      Alert.alert(
         "ಠ_ಠ",
         I18n.t("There seems to be a connection problem"),
         [
            {
               text: I18n.t("Try again"),
               onPress: async () => queryResult.refetch()
            }
         ],
         { cancelable: __DEV__ }
      );
   } else {
      Alert.alert(
         I18n.t("Error"),
         tryToGetErrorMessage(error),
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

export function defaultErrorHandlerForMutations<T>(
   options: UseMutationOptions<void, RequestError, T, unknown>
): UseMutationOptions<void, RequestError, T, unknown> {
   const newOptions = { ...options };
   newOptions.onError = error => {
      Alert.alert(
         I18n.t("Error"),
         tryToGetErrorMessage(error),
         [
            {
               text: I18n.t("OK")
            }
         ],
         { cancelable: true }
      );
   };
   return newOptions;
}

export function invalidateCacheForOptions<T = void>(
   queriesList: string[],
   options: UseMutationOptions<void, RequestError, T>
): UseMutationOptions<void, RequestError, T> {
   const newOptions = { ...options };
   if (queriesList == null || queriesList.length === 0) {
      return newOptions;
   }

   newOptions.onSuccess = (data, variables, context) => {
      if (options?.onSuccess != null) {
         options.onSuccess(data, variables, context);
      }
      invalidateCacheMultiple(queriesList);
   };
   return newOptions;
}

export function invalidateCacheMultiple(queriesList: string[]) {
   queriesList.forEach(query => queryClient.invalidateQueries(query));
}

export function defaultOptionsForMutations<T>(props: {
   queriesToInvalidate?: string[];
   extraOptions?: MutationExtraOptions;
   options: UseMutationOptions<void, RequestError, T>;
}): UseMutationOptions<void, RequestError, T> {
   const { queriesToInvalidate, extraOptions, options = {} } = props;
   let newOptions = defaultErrorHandlerForMutations(options);
   newOptions =
      extraOptions?.autoInvalidateQueries === false
         ? options
         : invalidateCacheForOptions(queriesToInvalidate, newOptions);
   return newOptions;
}

export interface RequestError {
   message: string;
   response: any;
}

export interface MutationExtraOptions {
   autoInvalidateQueries?: boolean;
}
