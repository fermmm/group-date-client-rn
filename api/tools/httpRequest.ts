import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import I18n from "i18n-js";
import Constants, { AppOwnership } from "expo-constants";
import { showRequestErrorAlert } from "./showRequestErrorAlert";
import { finishMeasureTime, measureTime } from "../../common-tools/js-tools/measureTime";
import { analyticsResponseTimeLog } from "../../common-tools/analytics/tools/analyticsRequestTimeLog";

export interface AxiosRequestConfigExtended extends AxiosRequestConfig {
   handleErrors?: boolean;
   hideRetryAlertOnConnectionFail?: boolean;
   errorResponseSilent?: boolean;
   sendResponseTimeToAnalytics?: boolean;
}

/**
 * Axios request wrapper with optional error handling and other react native expo related features.
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

   if (!options.handleErrors) {
      const response: AxiosResponse<Response> = await client(options);
      promiseResolve(response?.data);
      return resultPromise;
   }

   try {
      const response: AxiosResponse<Response> = await client(options);
      promiseResolve(response.data);
   } catch (error) {
      if (error.response) {
         // Request was made but server responded with something
         // other than 2xx
         console.debug("Request error:", error.response);

         if (!options.errorResponseSilent) {
            showRequestErrorAlert({
               title: error?.response?.status,
               errorMsg: tryToGetErrorMessage(error)
            });
         }

         promiseResolve(null);
      } else {
         // Something else happened while setting up the request
         // triggered the error
         console.debug("Request error:", error.message);

         if (!options.hideRetryAlertOnConnectionFail) {
            showRequestErrorAlert({
               retryFn: async () => promiseResolve(await httpRequest(options))
            });
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
         onFinishMeasurement: (id, time) => analyticsResponseTimeLog(id, method.toLowerCase(), time)
      });
   }

   const response = await httpRequest<Response>(axiosObject);

   if (options?.sendResponseTimeToAnalytics !== false) {
      finishMeasureTime(url);
   }

   return response;
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

export function getServerUrl(): string {
   if (__DEV__ && Constants.appOwnership === AppOwnership.Expo) {
      return prepareUrl(process.env.SERVER_URL_DEVELOPMENT);
   }

   return prepareUrl(process.env.SERVER_URL_PRODUCTION);
}

export interface RequestError {
   message: string;
   response: any;
}
