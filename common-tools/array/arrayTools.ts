/**
 * Checks if any element of array1 is included in array2.
 * The order of the parameters doesn't matter because when A includes B it also means B includes A.
 */
export function includesAnyOf<T>(array1: readonly T[], array2: readonly T[]): boolean {
   return array1.find(e => array2.includes(e)) != null;
}
