import { useEffect, useMemo, useState } from "react";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { filterArrayByStringSearch } from "../../../../common-tools/strings/filterArrayByStringSearch";
import { useOnlyVisibleTags } from "../../../../common-tools/tags/useOnlyVisibleTags";

export function useTagListFilteredBySearch(list: Tag[], searchText: string): Tag[] {
   let tagList = useOnlyVisibleTags(list);
   return useMemo(() => {
      if (!searchText) {
         return [];
      }

      const search = filterArrayByStringSearch(tagList, searchText, item => [
         item.name,
         item.category
      ]);

      return search;
   }, [searchText, tagList]);
}
