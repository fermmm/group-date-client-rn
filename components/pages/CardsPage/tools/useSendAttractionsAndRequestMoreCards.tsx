import { useEffect } from "react";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { sendAttraction } from "../../../../api/server/user";
import { revalidate } from "../../../../api/tools/useCache";
import { CardsSource } from "./types";
import { AttractionsSendReason, UseCardsDataManager } from "./useCardsDataManager";

/**
 * Sends attractions and request more cards when needed
 */
export function useSendAttractionsAndRequestMoreCards(params: UseSendAttractionsParams) {
   useEffect(() => {
      (async () => {
         await sendAttractionsIfNeeded(params);
         requestMoreCardsIfNeeded(params);
      })();
   }, [params.manager.attractionsShouldBeSentReason]);
}

async function sendAttractionsIfNeeded(params: UseSendAttractionsParams) {
   const { token, manager } = params;
   const reason = manager.attractionsShouldBeSentReason.reason;

   if (reason === AttractionsSendReason.None) {
      return;
   }

   // If there no attractions queue to send
   if (manager.attractionsQueue.current == null || manager.attractionsQueue.current.length === 0) {
      return;
   }

   // Send the attractions queue
   const attractions = [...manager.attractionsQueue.current];
   await sendAttraction({ attractions, token });
   manager.removeFromAttractionsQueue(attractions);
}

function requestMoreCardsIfNeeded(params: UseSendAttractionsParams) {
   const { manager, cardsSource, cardsFromServer, tagId } = params;
   const reason = manager.attractionsShouldBeSentReason.reason;

   /**
    * Revalidation is only needed when there are no more cards or nearly there are no more cards.
    * Sending because time passed or other reasons doesn't require to get more cards.
    */
   if (
      reason !== AttractionsSendReason.NoMoreUsersButServerMayHave &&
      reason !== AttractionsSendReason.NearlyRunningOutOfUsers
   ) {
      return;
   }

   // If last time the server returned empty then there is no need to request again
   if (cardsFromServer?.length === 0) {
      return;
   }

   /**
    * Load more while reviewing the users is not possible when navigating disliked users because disliked
    * users list may contain repetitions: The action of disliking keeps the users on the disliked list,
    * so this repetitions mentioned are caused by this cycling effect.
    */
   if (cardsSource !== CardsSource.DislikedUsers) {
      manager.inNextUpdateAppendNewUsersToRenderList();
   }

   /**
    * This triggers the request of new users by invalidating the cache. We invalidate all kinds of users list
    * because sending the attractions may affect the result of all types of users lists.
    */
   revalidate("cards-game/recommendations");
   revalidate("cards-game/disliked-users");
   revalidate("cards-game/from-tag-" + tagId);
}

interface UseSendAttractionsParams {
   token: string;
   cardsSource: CardsSource;
   manager: UseCardsDataManager;
   cardsFromServer: User[];
   tagId?: string;
}