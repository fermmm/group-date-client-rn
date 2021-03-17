import { firstBy } from "thenby";
import { getStringSimilarity } from "./getStringSimilarity";

/**
 * Filters an array using search keywords, usage example:
 *
 * const results = filterArrayByStringSearch(userList, "mike", user => [user.name, user.nickName]);
 *
 * @param arr The array to return filtered
 * @param searchWords The words to search in each array element
 * @param comparerFunction A function that returns an array of strings extracted from the item to be compared with the search keywords
 */
export function filterArrayByStringSearch<T>(
   arr: T[],
   searchWords: string,
   comparerFunction: (item: T) => string[]
): T[] {
   const results: Array<{ item: T; similarity: number }> = [];

   arr.forEach(item => {
      const similarity = getStringSimilarity(searchWords, comparerFunction(item).join(" "));
      if (similarity > 0.3) {
         results.push({ item, similarity });
      }
   });

   results.sort(firstBy(item => item.similarity, "desc"));

   return results.map(item => item.item);
}
