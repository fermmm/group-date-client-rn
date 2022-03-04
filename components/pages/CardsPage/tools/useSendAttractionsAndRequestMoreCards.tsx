import { useEffect } from "react";
import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { sendAttraction } from "../../../../api/server/user";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { revalidate } from "../../../../api/tools/useCache/useCache";
import { CardsSource } from "./types";
import {
   AttractionsSendReason,
   RequestMoreUsersReason,
   UseCardsDataManager
} from "./useCardsDataManager";
import { refreshCards } from "./refreshCards";

/**
 * Sends attractions and request more cards when needed
 */
export function useRequestMoreCardsWhenNeeded(params: UseRequestMoreCardsParams) {
   const { token } = useAuthentication();

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
   const { token } = useAuthentication();

   useEffect(() => {
      const reason = params.manager.attractionsShouldBeSentReason;
      if (reason === AttractionsSendReason.None) {
         return;
      }

      sendAttractions(token, params);
   }, [params.manager.attractionsShouldBeSentReason]);
}

async function sendAttractions(token: string, params: UseSendAttractionsParams) {
   const { manager } = params;

   manager.setAttractionsShouldBeSentReason(AttractionsSendReason.None);

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
   const { manager, cardsSource, cardsFromServer, tagId, disableAppendMode } = params;
   const reason = manager.shouldRequestMoreUsersReason;

   manager.setShouldRequestMoreUsersReason(RequestMoreUsersReason.None);

   if (reason == RequestMoreUsersReason.None) {
      return;
   }

   // If last time the server returned empty then there is no need to request again
   if (cardsFromServer?.length === 0) {
      return;
   }

   /**
    * Load more while reviewing the users is not possible when navigating disliked users because disliked
    * users list may contain repetitions: The action of disliking makes the same users appear again when
    * requesting the disliked list again, then the dedup logic deletes the new users creating and empty update.
    * The solution is to not append the new users when loading disliked and replace the list instead.
    */
   if (cardsSource !== CardsSource.DislikedUsers && !disableAppendMode) {
      manager.inNextUpdateAppendNewUsersToRenderList();
   }

   /**
    * This triggers the request of new users by invalidating the cache. We invalidate all kinds of users list
    * because sending the attractions may affect the result of all types of users lists. This will only trigger
    * a server request on the endpoint being used.
    */
   refreshCards({ alsoRefreshCardsFromTagId: tagId, alsoRefreshDislikedUsersCache: true });
}

interface UseSendAttractionsParams {
   manager: UseCardsDataManager;
}

interface UseRequestMoreCardsParams extends UseSendAttractionsParams {
   cardsSource: CardsSource;
   cardsFromServer: User[];
   tagId?: string;
   disableAppendMode?: boolean;
}
