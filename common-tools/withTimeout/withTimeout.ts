import { tryToGetErrorMessage } from "../../api/tools/httpRequest";
import { tryToStringifyObject } from "../debug-tools/tryToStringifyObject";

/**
 * Wrapper when executing an async function that adds timeout functionality. After the time finishes the promise is rejected (by default) or resolved depending on the configuration you provide.
 * This is specially useful if you are calling an async function from a library and you don't want the potential situation of the async function never responding because the library is not well implemented.
 *
 * @example
 *
 * // With default values (promise is rejected after 8 seconds):
 * const userData = await withTimeout(getUserDataAsync);
 *
 * // With a custom time amount:
 * const userData = await withTimeout(getUserDataAsync, { timeoutMilliseconds: 5000 });
 *
 * // You also can pass the promise instead of a function, this is useful if your async function needs parameters:
 * const userData = await withTimeout(getUserDataAsync("bob"));
 *
 * // With promise resolved on timeout:
 * const userData = await withTimeout(getUserDataAsync, { rejectOnTimeout: false, returnValueOnTimeout: genericUserData });
 */
export async function withTimeout<T>(
   promise: Promise<T> | (() => Promise<T>),
   settings?: WithTimeoutSettings<T>
): Promise<T> {
   const {
      timeoutMilliseconds = 8000,
      rejectOnTimeout = true,
      returnValueOnTimeout = null
   } = settings ?? {};

   // We save the stack trace to use it in case of an error. This cannot be done inside the specific error location because the stack information is lost there. Doing it here is still useful.
   let stackTrace: Error;
   try {
      throw new Error("Full stack trace:");
   } catch (e) {
      stackTrace = e;
   }

   let resolve: (value?: T | PromiseLike<T>) => void;
   let reject: (reason?: Error | string) => void;

   const result = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
   });

   let isTimedOut = false;
   let responded = false;
   let finalPromise: Promise<T> = typeof promise === "function" ? promise() : promise;

   finalPromise
      .then(value => {
         if (isTimedOut) {
            console.error(
               "withTimeout(): Promise resolved after is timed out. Maybe you need to increase the time. This is the resolved result: " +
                  tryToStringifyObject(value)
            );
            console.error(stackTrace);
            return;
         }
         responded = true;
         resolve(value);
      })
      .catch(error => {
         if (isTimedOut) {
            console.error(
               "withTimeout(): Promise is rejected after is timed out. Maybe you need to increase the time. This is the error message: " +
                  tryToGetErrorMessage(error)
            );
            console.error(stackTrace);
            return;
         }
         responded = true;
         reject(error);
      });

   setTimeout(() => {
      if (responded) {
         return;
      }

      isTimedOut = true;
      if (rejectOnTimeout) {
         reject(`Promise timed out after ${timeoutMilliseconds} ms.`);
      } else {
         console.error(`Promise timed out after ${timeoutMilliseconds} ms.`);
         console.error(stackTrace);
         resolve(returnValueOnTimeout);
      }
   }, timeoutMilliseconds);

   return result;
}

export interface WithTimeoutSettings<T> {
   /**
    * Default 8000 (8 seconds)
    */
   timeoutMilliseconds?: number;
   /**
    * Default true. If this is set to false the response will be a resolve instead of reject. You can configure the returned value with the returnValueOnTimeout property.
    */
   rejectOnTimeout?: boolean;
   /**
    * Default: null. Only used if rejectOnTimeout is set to false. This is the value that will be returned when the timeout is reached.
    */
   returnValueOnTimeout?: T;
}
