import { useUser } from "./../../../../api/server/user";
import { useMemo } from "react";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { UseTagsDividedScrollFormat } from "./useTagsDividedScrollFormat";

export function useUserTags(tagsFromServer: Tag[]) {
   const { data: user } = useUser();

   return useMemo<UseTagsDividedScrollFormat[]>(() => {
      if (tagsFromServer == null || user == null) {
         return [];
      }

      const tagsSubscribedCompleteInfo = user.tagsSubscribed.map(userTag =>
         tagsFromServer.find(tag => userTag.tagId === tag.tagId)
      );

      const tagsBlockedCompleteInfo = user.tagsBlocked.map(userTag =>
         tagsFromServer.find(tag => userTag.tagId === tag.tagId)
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
   }, [tagsFromServer, user]);
}
