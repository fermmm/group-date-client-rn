/**
 * If a user shares a way of contacting them personally the string information is
 * removed. Example: "My instagram is @fer, see you there!" will be changed to:
 * "My see you there!".
 */
export function removeSocialNetworkContact(str: string) {
   let result: string = str;

   // For the moment only instagram is banned
   const clues = ["ig", "insta", "instagram"];
   const punctuationsAfterClue = [" ", ".", ":"];
   const maxRemovals = 50;

   clues.forEach(clue => {
      punctuationsAfterClue.forEach(punctuation => {
         result = iterateRemovePhraseStartingWith(result, clue + punctuation, maxRemovals);
      });
   });

   return result;
}

/**
 * Executes removePhraseStartingWith() multiple times for each coincidence.
 */
function iterateRemovePhraseStartingWith(str: string, clue: string, maxRemovals: number) {
   let result = str;
   for (let i = 0; i < maxRemovals; i++) {
      const iterationRes = removePhraseStartingWith(result, clue);
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
function removePhraseStartingWith(str: string, beginning: string) {
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
