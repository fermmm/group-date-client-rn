/**
 * Wrapper when executing an async function that adds timeout functionality. After the time finishes the promise is rejected or resolved depending on the configuration you provide.
 *
 * @example
 *
 * // With default values (promise is rejected after 8 seconds):
 * const userData = await withTimeout(getUserDataAsync);
 *
 * // With a custom time amount:
 * const result = await withTimeout(asyncFunction, { timeoutMilliseconds: 5000 });
 *
 * // You also can pass the promise instead of a function, this is useful if your async function needs parameters:
 * const result = await withTimeout(asyncFunction("hello"));
 *
 * // With promise resolved on timeout:
 * const result = await withTimeout(asyncFunction, { rejectOnTimeout: false, returnValueOnTimeout: yourAlternativeValue });
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

   const timeout = new Promise((resolve, reject) =>
      setTimeout(() => {
         if (rejectOnTimeout) {
            reject(`Timed out after ${timeoutMilliseconds} ms.`);
         } else {
            console.error(`Timed out after ${timeoutMilliseconds} ms.`);
            resolve(returnValueOnTimeout);
         }
      }, timeoutMilliseconds)
   );

   let finalPromise: Promise<T> = typeof promise === "function" ? promise() : promise;

   return Promise.race([finalPromise, timeout]) as Promise<T>;
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
