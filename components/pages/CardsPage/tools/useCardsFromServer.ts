import {
   useCardsDisliked,
   useCardsFromTag,
   useCardsRecommendations
} from "../../../../api/server/cards-game";
import { CardsSource } from "./types";

export function useCardsFromServer(
   cardsSource: CardsSource,
   options?: { tagId?: string; enabled?: boolean }
) {
   const { data: recommendations } = useCardsRecommendations({
      config: {
         enabled: cardsSource === CardsSource.Recommendations && options?.enabled !== false
      }
   });

   const { data: dislikedUsers } = useCardsDisliked({
      config: {
         enabled: cardsSource === CardsSource.DislikedUsers && options?.enabled !== false
      }
   });

   const { data: usersFromTag } = useCardsFromTag({
      requestParams: { tagId: options?.tagId },
      config: {
         enabled:
            cardsSource === CardsSource.Tag && options?.tagId != null && options?.enabled !== false
      }
   });

   if (cardsSource === CardsSource.Recommendations) {
      return recommendations;
   }

   if (cardsSource === CardsSource.DislikedUsers) {
      return dislikedUsers;
   }

   if (cardsSource === CardsSource.Tag) {
      return usersFromTag;
   }
}
