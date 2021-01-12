import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Alert } from "react-native";
import I18n from "i18n-js";

export interface AxiosRequestConfigExtended extends AxiosRequestConfig {
   handleErrors?: boolean;
   hideRetryAlertOnConnectionFail?: boolean;
   errorResponseSilent?: boolean;
}

/**
 * Axios request wrapper with optional error handling and other react native expo related features.
 * @param options Axios request options, example: {url: "search/users", method: "GET", data: {myBodyProp: "bodyValue"}}
 * @param showAlertOnError Shows a native alert to the user when the request has a network error
 * @returns When there is an error in the request returns a string resolved promise with the error text.
 */
export async function httpRequest<T>(options: AxiosRequestConfigExtended): Promise<T> {
   const client: AxiosInstance = axios.create(options);

   let promiseResolve: (value?: T | PromiseLike<T>) => void = null;
   const resultPromise: Promise<T> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   if (!options.handleErrors) {
      const response: AxiosResponse<T> = await client(options);
      promiseResolve(response?.data);
      return resultPromise;
   }

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
               `ಠ_ಠ ${error.response.status}`,
               tryToGetErrorMessage(error),
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
               "ಠ_ಠ",
               I18n.t("There seems to be a connection problem"),
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

export function tryToGetErrorMessage(error: any): string {
   if (error == null) {
      return "";
   }

   if (error.response == null) {
      return error.message ?? "";
   }

   if (error.response.data?.error?.message) {
      return error.response.data.error.message;
   }

   if (error.response.data?.[0].message != null) {
      return error.response.data[0].message;
   }

   return error.message;
}
