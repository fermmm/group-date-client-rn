import { Method } from "axios";
import I18n from "i18n-js";
import { Alert, LogBox } from "react-native";
import { QueryClient, QueryObserverResult, UseMutationOptions } from "react-query";
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

export async function defaultRequestFunction<D = void, R = void>(
   url: string,
   method: Method,
   data?: D
): Promise<R> {
   const axiosObject: AxiosRequestConfigExtended = {
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
   options.onError = error => {
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
   return options;
}

export interface RequestError {
   message: string;
   response: any;
}
