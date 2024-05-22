import { Platform } from "react-native";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import I18n from "i18n-js";
import Constants, { AppOwnership } from "expo-constants";
import { showRequestErrorAlert } from "./showRequestErrorAlert";
import { finishMeasureTime, measureTime } from "../../common-tools/js-tools/measureTime";
import { analyticsResponseTimeLog } from "../../common-tools/analytics/tools/analyticsRequestTimeLog";
import { SERVER_URL_DEVELOPMENT, SERVER_URL_PRODUCTION } from "../../.env.config";
import { LOCALHOST_MODE } from "../../config";

export interface AxiosRequestConfigExtended extends AxiosRequestConfig {
   handleErrors?: boolean;
   hideRetryAlertOnConnectionFail?: boolean;
   errorResponseSilent?: boolean;
   sendResponseTimeToAnalytics?: boolean;
}

/**
 * Axios request wrapper with optional error handling and other react native expo related features.
 * Use this function to make requests to external services, don't use this function to call the app server API use defaultHttpRequest() instead.
 * @param options Axios request options, example: {url: "search/users", method: "GET", data: {myBodyProp: "bodyValue"}}
 * @param showAlertOnError Shows a native alert to the user when the request has a network error
 * @returns When there is an error in the request returns a string resolved promise with the error text.
 */
export async function httpRequest<Response>(
   options: AxiosRequestConfigExtended
): Promise<Response> {
   const client: AxiosInstance = axios.create(options);

   let promiseResolve: (value?: Response | PromiseLike<Response>) => void = null;
   const resultPromise: Promise<Response> = new Promise(resolve => {
      promiseResolve = resolve;
   });

   if (!options?.handleErrors) {
      const response: AxiosResponse<Response> = await client(options);
      promiseResolve(response?.data);
      return resultPromise;
   }

   try {
      const response: AxiosResponse<Response> = await client(options);
      promiseResolve(response.data);
   } catch (error) {
      if (error.response) {
         promiseResolve(null);

         // Request was made but server responded with something
         // other than 2xx
         console.debug("Request error:", error.response);

         if (!options?.errorResponseSilent) {
            showRequestErrorAlert({
               title: error?.response?.status,
               errorMsg: tryToGetErrorMessage(error)
            });
         }
      } else {
         // Something else happened while setting up the request
         // triggered the error
         console.debug("Request error:", error.message);

         if (!options?.hideRetryAlertOnConnectionFail) {
            showRequestErrorAlert({
               retryFn: async () => promiseResolve(await httpRequest(options))
            });
         } else {
            promiseResolve(null);

            showRequestErrorAlert({
               title: error?.response?.status ?? "",
               errorMsg: tryToGetErrorMessage(error)
            });
         }
      }
   }

   return resultPromise;
}

export function tryToGetErrorMessage(error: any): string {
   if (error == null) {
      return "";
   }

   if (typeof error === "string") {
      return error;
   }

   if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
   }

   if (error.response?.data?.[0]?.message != null) {
      return error.response.data[0].message;
   }

   if (error.response?.data != null) {
      return error.response.data;
   }

   if (error.response != null) {
      return error.response;
   }

   if (error.message != null) {
      return error.message;
   }

   return "No information found";
}

/**
 * This request function should be used to call the app server since it contains any of it's requirements.
 */
export async function defaultHttpRequest<Params = void, Response = void>(
   url: string,
   method: Method,
   data?: Params,
   options?: AxiosRequestConfigExtended
): Promise<Response> {
   const axiosObject: AxiosRequestConfigExtended = {
      ...(options ?? {}),
      headers: { "Accept-Language": I18n.locale },
      baseURL: getServerUrl(),
      url,
      method
   };

   // Get requests does not support data object, only params
   if (method.toLowerCase() === "get") {
      axiosObject.params = data;
   } else {
      axiosObject.data = data;
   }

   if (options?.sendResponseTimeToAnalytics !== false) {
      measureTime({
         measurementId: url,
         executeMeasurementOnlyOnce: true,
         maxTimeOfMeasurementMs: 15 * 1000,
         onFinishMeasurement: (id, time) => analyticsResponseTimeLog(id, method.toUpperCase(), time)
      });
   }

   const response = await httpRequest<Response>(axiosObject);

   if (options?.sendResponseTimeToAnalytics !== false) {
      finishMeasureTime(url);
   }

   return response;
}

export function getServerUrl(): string {
   if ((__DEV__ && Constants.appOwnership === AppOwnership.Expo) || LOCALHOST_MODE) {
      return prepareUrl(SERVER_URL_DEVELOPMENT);
   }

   return prepareUrl(SERVER_URL_PRODUCTION);
}

/**
 * Currently this function only replaces the localhost part of the url by the local address of the development
 * machine otherwise localhost will be the localhost of the phone (or emulator) and not the machine one, if the app is
 * executing in production there is no localhost part on the url so this function does nothing and returns the string unchanged.
 */
export function prepareUrl(url: string): string {
   if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
      return url;
   }

   let newUrl = url;

   if (Constants.appOwnership === AppOwnership.Expo) {
      // Expo maps Constants.manifest.debuggerHost to the localhost address of the development machine (we need to remove the port part)
      newUrl = newUrl.replace("localhost", Constants.manifest.debuggerHost.split(`:`).shift());
      newUrl = newUrl.replace("127.0.0.1", Constants.manifest.debuggerHost.split(`:`).shift());
   } else if (Platform.OS === "android") {
      // Android emulator maps 10.0.2.2 to the localhost address of the development machine
      newUrl = newUrl.replace("localhost", "10.0.2.2");
      newUrl = newUrl.replace("127.0.0.1", "10.0.2.2");
   }
   // IOS emulator does not need any of this because maps localhost address of the development machine to the localhost address of the phone (or emulator)

   return newUrl;
}

export interface RequestError {
   message: string;
   response: any;
}
