import { Method } from "axios";
import { Alert, LogBox } from "react-native";
import { QueryClient, QueryObserverResult } from "react-query";
import { AxiosRequestConfigExtended, httpRequest } from "./httpRequest";

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
   const error = (queryResult as QueryObserverResult<T, { message: string; response: string }>)
      .error;
   if (error.response == null) {
      Alert.alert(
         "ಠ_ಠ",
         "Parece que hay un problema de conexión",
         [
            {
               text: "Reintentar",
               onPress: async () => queryResult.refetch()
            }
         ],
         { cancelable: __DEV__ }
      );
   } else {
      Alert.alert(
         "Error",
         error.message,
         [
            {
               text: "Ok"
            }
         ],
         { cancelable: true }
      );
   }

   return queryResult;
}
