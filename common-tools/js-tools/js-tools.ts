/**
 * Mutates the array moving the desired element to the target position.
 *
 * Example: given ["a","b","c","d"] after moving "c" to the first position: ["c", "a", "b", "d"]
 */
export function moveElementInArray<T>(arr: T[], from: number, to: number): void {
   arr.splice(to, 0, arr.splice(from, 1)[0]);
}
