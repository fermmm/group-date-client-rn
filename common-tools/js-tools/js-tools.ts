/**
 * Mutates the array moving the desired element to the target position.
 *
 * Example: given ["a","b","c","d"] after moving "c" to the first position: ["c", "a", "b", "d"]
 */
export function moveElementInArray<T>(arr: T[], from: number, to: number): void {
   arr.splice(to, 0, arr.splice(from, 1)[0]);
}

/**
 * Merges array1 into array2 at a specific index of array2. Returns the new array, original arrays are not modified.
 *
 * @param index
 * @param array1
 * @param array2
 * @param options If you set {replace : true} it will replace the item at the specified index by all the elements of array1
 */
export function mergeArraysAt<T>(
   index: number,
   array1: T[] = [],
   array2: T[] = [],
   options?: { replace: boolean }
): T[] {
   if (!isValidNumber(index) || index < 0) {
      index = 0;
   }

   let slice1 = [...array2];
   let slice2 = [...array2];
   slice1 = slice1.slice(0, index);
   if (options?.replace === true) {
      slice2 = slice2.slice(index + 1);
   } else {
      slice2 = slice2.slice(index);
   }
   return [...slice1, ...array1, ...slice2];
}

export function isValidNumber(n: number): boolean {
   return typeof n == "number" && !isNaN(n) && isFinite(n);
}

/**
 * Converts the first character of a string to upper case
 */
export function toFirstUpperCase(str: string): string {
   if (str == null) {
      return str;
   }

   if (str.length < 1) {
      return str;
   }

   return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Performs a shallow comparison of the values of 2 objects using the strict equality operator.
 * Different order of keys does not affect the result.
 */
export function objectsContentIsEqual<T>(
   object1: T,
   object2: T,
   options?: ObjectsContentIsEqualOptions
): boolean {
   const { object2CanHaveMoreProps = false } = options ?? {};

   // If the reference is the same the objects are equal.
   if (object1 === object2) {
      return true;
   }

   // If one of the objects is null and the other undefined they are not equal
   if ((object1 === null && object2 === undefined) || (object2 === null && object1 === undefined)) {
      return false;
   }

   // If one of the objects is null or undefined and the other not they are not equal
   if ((object1 == null && object2 != null) || (object2 == null && object1 != null)) {
      return false;
   }

   // Now at this point we are sure that none of both objects are null or undefined so we can compare the elements
   const object1Keys: string[] = Object.keys(object1 ?? {});
   const object2Keys: string[] = Object.keys(object2 ?? {});

   if (!object2CanHaveMoreProps) {
      if (object1Keys.length !== object2Keys.length) {
         return false;
      }
   }

   for (const key of object1Keys) {
      if (!object2.hasOwnProperty(key)) {
         return false;
      }
      if (!equalityWithArray(object1[key], object2[key])) {
         return false;
      }
   }

   return true;
}

export interface ObjectsContentIsEqualOptions {
   object2CanHaveMoreProps?: boolean;
}

/**
 * Checks for equality with 2 elements, if the elements are arrays converts them to strings and compares
 */
function equalityWithArray(obj1: any, obj2: any): boolean {
   if (Array.isArray(obj1) && Array.isArray(obj2)) {
      return obj1.join() === obj2.join();
   }
   return obj1 === obj2;
}
