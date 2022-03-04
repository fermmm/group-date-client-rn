/**
 * Executes an async function with a timeout.
 *
 * @param promise
 * @param timeoutMilliseconds Default: 10000 (10 seconds)
 * @example
 *
 * // With default 10 seconds timeout:
 * await withTimeout(doSomethingAsync());
 *
 * // With a custom time amount:
 * await withTimeout(doSomethingAsync(), 5000);
 */
export async function withTimeout<T>(
   promise: Promise<T>,
   timeoutMilliseconds: number = 10000
): Promise<T> {
   const timeout = new Promise((resolve, reject) =>
      setTimeout(() => reject(`Timed out after ${timeoutMilliseconds} ms.`), timeoutMilliseconds)
   );
   return Promise.race([promise, timeout]) as Promise<T>;
}
