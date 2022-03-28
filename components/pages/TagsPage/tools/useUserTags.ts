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

      let tagsSubscribedCompleteInfo = userTagsSubscribed?.map(userTag =>
         tagList.find(tag => userTag.tagId === tag.tagId)
      );

      let tagsBlockedCompleteInfo = userTagsBlocked?.map(userTag =>
         tagList.find(tag => userTag.tagId === tag.tagId)
      );

      /*
       * Users may potentially change language : All the tags that the user subscribed in a
       * different language will be null here, so we have to remove them.
       * This is because tagList is per language.
       */
      tagsSubscribedCompleteInfo = tagsSubscribedCompleteInfo.filter(tag => tag != null);
      tagsBlockedCompleteInfo = tagsBlockedCompleteInfo.filter(tag => tag != null);

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
