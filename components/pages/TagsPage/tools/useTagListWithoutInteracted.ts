import { useState } from "react";
import { useEffect } from "react";
import { Tag, TagBasicInfo } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";

/**
 * Returns a new tag list without the tags the user has already interacted with (subscribed or blocked)
 */
export function useTagListWithoutInteracted(
   tagList: Tag[],
   tagsSubscribed: TagBasicInfo[],
   tagsBlocked: TagBasicInfo[]
): Tag[] {
   const [result, setResult] = useState([]);

   useEffect(() => {
      if (tagList == null) {
         return;
      }

      setResult(
         tagList.filter(
            tag =>
               tagsSubscribed?.find(subscribed => subscribed.tagId === tag.tagId) == null &&
               tagsBlocked?.find(blocked => blocked.tagId === tag.tagId) == null
         )
      );
   }, [tagList, tagsSubscribed, tagsBlocked]);

   return result;
}
