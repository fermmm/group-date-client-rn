import { useEffect, useState } from "react";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { filterArrayByStringSearch } from "../../../../common-tools/strings/filterArrayByStringSearch";

export function useTagListFilteredBySearch(list: Tag[], searchText: string): Tag[] {
   const [result, setResult] = useState([]);

   useEffect(() => {
      if (!searchText) {
         setResult(list);
         return;
      }
      const search = filterArrayByStringSearch(list, searchText, item => [
         item.name,
         item.category
      ]);
      setResult(search);
   }, [searchText, list]);

   return result;
}
