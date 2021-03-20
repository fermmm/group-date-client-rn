import { useEffect, useMemo, useState } from "react";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { filterArrayByStringSearch } from "../../../../common-tools/strings/filterArrayByStringSearch";

export function useTagListFilteredBySearch(list: Tag[], searchText: string): Tag[] {
   return useMemo(() => {
      if (!searchText) {
         return [];
      }

      const search = filterArrayByStringSearch(list, searchText, item => [
         item.name,
         item.category
      ]);

      return search;
   }, [searchText, list]);
}
