import {
   useCardsDisliked,
   useCardsFromTag,
   useCardsRecommendations
} from "../../../../api/server/cards-game";
import { CardsSource } from "./types";

export function useCardsFromServer(cardsSource: CardsSource, options?: { tagId?: string }) {
   const { data: recommendations } = useCardsRecommendations({
      config: {
         enabled: cardsSource === CardsSource.Recommendations
      }
   });

   const { data: dislikedUsers } = useCardsDisliked({
      config: {
         enabled: cardsSource === CardsSource.DislikedUsers
      }
   });

   const { data: usersFromTag } = useCardsFromTag({
      requestParams: { tagId: options?.tagId },
      config: {
         enabled: cardsSource === CardsSource.Tag && options?.tagId != null
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
