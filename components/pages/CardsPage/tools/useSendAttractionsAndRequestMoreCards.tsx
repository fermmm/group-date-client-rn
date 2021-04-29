import { useEffect } from "react";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { sendAttraction } from "../../../../api/server/user";
import { useFacebookToken } from "../../../../api/third-party/facebook/facebook-login";
import { revalidate } from "../../../../api/tools/useCache/useCache";
import { CardsSource } from "./types";
import {
   AttractionsSendReason,
   RequestMoreUsersReason,
   UseCardsDataManager
} from "./useCardsDataManager";

/**
 * Sends attractions and request more cards when needed
 */
export function useRequestMoreCardsWhenNeeded(params: UseRequestMoreCardsParams) {
   const { token } = useFacebookToken();

   useEffect(() => {
      (async () => {
         /**
          * We need to first send all the attraction queue contents otherwise the new user
          * list will contain already evaluated users that where not sent yet.
          */
         await sendAttractions(token, params);
         requestMoreCardsIfNeeded(params);
      })();
   }, [params.manager.shouldRequestMoreUsersReason]);
}

export function useSendAttractionsQueueIfNeeded(params: UseSendAttractionsParams) {
   const { token } = useFacebookToken();

   useEffect(() => {
      const reason = params.manager.attractionsShouldBeSentReason.reason;
      if (reason === AttractionsSendReason.None) {
         return;
      }
      sendAttractions(token, params);
   }, [params.manager.attractionsShouldBeSentReason]);
}

async function sendAttractions(token: string, params: UseSendAttractionsParams) {
   const { manager } = params;

   manager.setAttractionsShouldBeSentReason({ reason: AttractionsSendReason.None });

   // If there no attractions queue to send
   if (manager.attractionsQueue.current == null || manager.attractionsQueue.current.length === 0) {
      return;
   }

   // Send the attractions queue
   const attractions = [...manager.attractionsQueue.current];
   await sendAttraction({ attractions, token });
   manager.removeFromAttractionsQueue(attractions);
}

function requestMoreCardsIfNeeded(params: UseRequestMoreCardsParams) {
   const { manager, cardsSource, cardsFromServer, tagId } = params;
   const reason = manager.shouldRequestMoreUsersReason.reason;

   manager.setShouldRequestMoreUsersReason({ reason: RequestMoreUsersReason.None });

   if (reason == RequestMoreUsersReason.None) {
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
    * because sending the attractions may affect the result of all types of users lists. This will only trigger
    * a server request on the endpoint being used.
    */
   revalidate("cards-game/recommendations");
   revalidate("cards-game/disliked-users");
   revalidate("cards-game/from-tag-" + tagId);
}

interface UseSendAttractionsParams {
   manager: UseCardsDataManager;
}

interface UseRequestMoreCardsParams extends UseSendAttractionsParams {
   cardsSource: CardsSource;
   cardsFromServer: User[];
   tagId?: string;
}
