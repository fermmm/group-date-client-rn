import { useUser } from "./../../../../api/server/user";
import { useMemo } from "react";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { UseTagsDividedScrollFormat } from "./useTagsDividedScrollFormat";
import { useOnlyVisibleTags } from "../../../../common-tools/tags/useOnlyVisibleTags";

export function useUserTags(tagsFromServer: Tag[]) {
   let tagList = useOnlyVisibleTags(tagsFromServer);
   const { data: user } = useUser();
   const userTagsSubscribed = useOnlyVisibleTags(user?.tagsSubscribed);
   const userTagsBlocked = useOnlyVisibleTags(user?.tagsBlocked);

   return useMemo<UseTagsDividedScrollFormat[]>(() => {
      if (tagList == null || user == null) {
         return [];
      }

      const tagsSubscribedCompleteInfo = userTagsSubscribed?.map(userTag =>
         tagList.find(tag => userTag.tagId === tag.tagId)
      );

      const tagsBlockedCompleteInfo = userTagsBlocked?.map(userTag =>
         tagList.find(tag => userTag.tagId === tag.tagId)
      );

      return [
         {
            title: "Suscripciones",
            data: tagsSubscribedCompleteInfo
         },
         {
            title: "Ocultando subscriptores",
            data: tagsBlockedCompleteInfo
         }
      ];
   }, [tagList, userTagsSubscribed, userTagsBlocked]);
}
