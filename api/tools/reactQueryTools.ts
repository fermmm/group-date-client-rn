import { Method } from "axios";
import { Alert } from "react-native";
import { QueryCache, QueryResult } from "react-query";
import { AxiosRequestConfigExtended, httpRequest } from "./httpRequest";

export const queryCache = new QueryCache({
   defaultConfig: {
      queries: {
         staleTime: 1000 * 60 * 15
      },
      mutations: {}
   }
});

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

export function defaultErrorHandler<T>(queryResult: QueryResult<T>): QueryResult<T> {
   if (!queryResult.isError) {
      return queryResult;
   }
   const error = (queryResult as QueryResult<T, { message: string; response: string }>).error;
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
