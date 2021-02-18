import jsSHA from "jssha";

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

export function getUniqueHashOfString(str: string) {
   const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
   shaObj.update(str);
   return shaObj.getHash("HEX");
}
