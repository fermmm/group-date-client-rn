import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
import { Alert } from "react-native";
import { SERVER_URL } from "react-native-dotenv";

// TODO: Implement automatic retry which is silent the first time
export interface AxiosRequestConfigExtended extends AxiosRequestConfig {
   hideRetryAlertOnConnectionFail?: boolean;
   errorResponseSilent?: boolean;
}

/**
 * Axios request wrapper with error handling.
 * @param options Axios request options, example: {url: "search/users"}
 * @param showAlertOnError Shows a native alert to the user when the request has a network error
 * @returns When there is an error in the request returns a string resolved promise with the error text.
 */
export async function httpRequest<T>(options: AxiosRequestConfigExtended): Promise<T> {
   const client: AxiosInstance = axios.create({
      baseURL: SERVER_URL
   });

   let promiseResolve: (value?: T | PromiseLike<T>) => void = null;
   const resultPromise: Promise<T> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   try {
      const response: AxiosResponse<T> = await client(options);
      promiseResolve(response.data);
   } catch (error) {
      if (error.response) {
         // Request was made but server responded with something
         // other than 2xx
         console.debug("Request error:", error.response);

         if (!options.errorResponseSilent) {
            Alert.alert(
               `Error ${error.response.status}`,
               `${error.response.data?.error?.message}`,
               [{ text: "OK" }],
               { cancelable: false }
            );
         }

         promiseResolve(null);
      } else {
         // Something else happened while setting up the request
         // triggered the error
         console.debug("Request error:", error.message);
         if (!options.hideRetryAlertOnConnectionFail) {
            Alert.alert(
               "Error",
               "Parece que hay un problema de conexión",
               [
                  {
                     text: "Reintentar",
                     onPress: async () => promiseResolve(await httpRequest(options))
                  }
               ],
               { cancelable: false }
            );
         } else {
            promiseResolve(null);
         }
      }
   }

   return resultPromise;
}
