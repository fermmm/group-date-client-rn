/**
 * If a user shares a way of contacting them personally the string information is
 * removed. Example: "My instagram is @fer, see you there!" will be changed to:
 * "My see you there!".
 */
export function removeSocialNetworkContact(str: string): string {
   if (str == null) {
      return null;
   }

   let result: string = str;

   // For the moment only instagram is banned
   const removePhrasesStartingWith = ["ig", "insta", "instagram"];
   const removeWordsContaining = ["@"];
   const punctuationsUsedInBannedWords = [" ", ".", ":"];
   const maxRemovals = 50;

   removePhrasesStartingWith.forEach(clue => {
      punctuationsUsedInBannedWords.forEach(punctuation => {
         result = iterateRemovePhraseThatStarsWith(result, clue + punctuation, maxRemovals);
      });
   });

   removeWordsContaining.forEach(bannedCharacter => {
      result = removeWordsIncluding(result, bannedCharacter);
   });

   return result;
}

/**
 * Executes removePhraseStartingWith() multiple times for each coincidence.
 */
function iterateRemovePhraseThatStarsWith(str: string, clue: string, maxRemovals: number) {
   let result = str;
   for (let i = 0; i < maxRemovals; i++) {
      const iterationRes = removePhraseThatStarsWith(result, clue);
      if (iterationRes === result) {
         return result;
      }

      result = iterationRes;
   }
   return result;
}

/**
 * Removes a matched word, also removes the next word, if the next word has length of * 3 or
 * less then the next to that is also removed.
 */
function removePhraseThatStarsWith(str: string, beginning: string) {
   const beginningIndex = str.indexOf(beginning);

   if (beginningIndex === -1) {
      return str;
   }

   const followingWords = str.substring(beginningIndex).split(" ");
   const wordsToRemove = [followingWords[0]];
   if (followingWords[1]?.length <= 3) {
      wordsToRemove.push(followingWords[1]);
      if (followingWords[2] != null) {
         wordsToRemove.push(followingWords[2]);
      }
   } else {
      if (followingWords[1] != null) {
         wordsToRemove.push(followingWords[1]);
      }
   }
   const textToRemove = wordsToRemove.join(" ");

   return str.replace(textToRemove, "");
}

function removeWordsIncluding(str: string, wordIncluding: string): string {
   return str
      .split(" ")
      .filter(word => !word.includes(wordIncluding))
      .join(" ");
}
