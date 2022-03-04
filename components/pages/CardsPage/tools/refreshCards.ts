import { revalidate } from "../../../../api/tools/useCache/useCache";

export async function refreshCards(settings?: {
   alsoRefreshCardsFromTagId?: string;
   alsoRefreshDislikedUsersCache?: boolean;
}) {
   const { alsoRefreshCardsFromTagId, alsoRefreshDislikedUsersCache } = settings ?? {};

   await revalidate("cards-game/recommendations");

   if (alsoRefreshDislikedUsersCache) {
      await revalidate("cards-game/disliked-users");
   }

   if (alsoRefreshCardsFromTagId) {
      await revalidate("cards-game/from-tag-" + alsoRefreshCardsFromTagId);
   }
}
