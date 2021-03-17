import levenshtein from "talisman/metrics/levenshtein";

export function getStringSimilarity(string1: string, string2: string): number {
   const string1Words: string[] = string1.toLowerCase().split(" ");
   const string2Words: string[] = string2.toLowerCase().split(" ");

   const wordsSimilarities: number[] = [];
   string1Words.forEach(word1 => {
      string2Words.forEach(word2 => {
         let similarity: number = 0;

         if (word1.startsWith(word2) || word2.startsWith(word1)) {
            similarity = 1;
         } else {
            similarity = 1 - levenshtein(word1, word2) / Math.max(word1.length, word2.length);
         }

         wordsSimilarities.push(similarity);
      });
   });

   return Math.max(...wordsSimilarities);
}
