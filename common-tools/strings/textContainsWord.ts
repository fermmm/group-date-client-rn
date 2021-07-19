export function textContainsAnyWord(text: string, words: string[]): boolean {
   let result = false;
   words.forEach(word => {
      if (text.toLocaleLowerCase().includes(word.toLowerCase())) {
         result = true;
      }
   });

   return result;
}
