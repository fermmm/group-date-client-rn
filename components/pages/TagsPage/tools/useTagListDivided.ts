import { useEffect, useState } from "react";
import { firstBy } from "thenby";
import { extractFromArray } from "./../../../../common-tools/js-tools/js-tools";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";

/**
 * Divides the list of tags into categories with a maximum size, leaving the remaining tags in the "rest" category
 */
export function useTagListDivided(
   tagList: Tag[],
   options?: { amountPerCategory?: number }
): UseTagListDivided {
   const [globals, setGlobals] = useState([]);
   const [withMoreSubscribers, setWithMoreSubscribers] = useState([]);
   const [withMoreBlockers, setWithMoreBlockers] = useState([]);
   const [withMoreSubscribersAndBlockersMixed, setWithMoreSubscribersAndBlockersMixed] = useState(
      []
   );
   const [withMostRecentInteraction, setWithMostRecentInteraction] = useState([]);
   const [newest, setNewest] = useState([]);
   const [rest, setRest] = useState([]);

   useEffect(() => {
      if (tagList == null) {
         return;
      }

      // Prevents mutation
      tagList = [...tagList];

      // Extract globals
      const globalsExt = extractFromArray(tagList, value => value.global);
      tagList = globalsExt.result;
      globalsExt.extracted.sort(firstBy("category", { ignoreCase: true }).thenBy("name"));
      setGlobals(globalsExt.extracted);

      // Extract newest
      tagList.sort(firstBy(value => value.creationDate ?? 0, "desc"));
      const newestExt = extractFromArray(
         tagList,
         (value, i) => i < (options?.amountPerCategory ?? 10)
      );
      tagList = newestExt.result;
      newestExt.extracted.sort(firstBy("category", { ignoreCase: true }).thenBy("name"));
      setNewest(newestExt.extracted);

      // Extract with more subscribers
      tagList.sort(firstBy(value => value.subscribersAmount ?? 0, "desc"));
      const subscribersExt = extractFromArray(
         tagList,
         (value, i) => i < (options?.amountPerCategory ?? 10)
      );
      tagList = subscribersExt.result;
      subscribersExt.extracted.sort(firstBy("category", { ignoreCase: true }).thenBy("name"));
      setWithMoreSubscribers(subscribersExt.extracted);

      // Extract with more blockers
      tagList.sort(firstBy(value => value.blockersAmount ?? 0, "desc"));
      const blockersExt = extractFromArray(
         tagList,
         (value, i) => i < (options?.amountPerCategory ?? 10)
      );
      tagList = blockersExt.result;
      blockersExt.extracted.sort(firstBy("category", { ignoreCase: true }).thenBy("name"));
      setWithMoreBlockers(blockersExt.extracted);

      // Mix withMoreSubscribers and withMoreBlockers in a single list just to have another option
      setWithMoreSubscribersAndBlockersMixed(
         [...subscribersExt.extracted, ...blockersExt.extracted].sort(
            firstBy("category", { ignoreCase: true }).thenBy("name")
         )
      );

      // Extract with more recent interaction
      tagList.sort(firstBy(value => value.lastInteractionDate ?? 0, "desc"));
      const recentInteractExt = extractFromArray(
         tagList,
         (value, i) => i < (options?.amountPerCategory ?? 10)
      );
      tagList = recentInteractExt.result;
      recentInteractExt.extracted.sort(firstBy("category", { ignoreCase: true }).thenBy("name"));
      setWithMostRecentInteraction(recentInteractExt.extracted);

      // Sort remaining list by subscriptores + blockers (popularity)
      tagList.sort(
         firstBy(value => (value.subscribersAmount ?? 0) + (value.blockersAmount ?? 0), "desc")
      );
      setRest(tagList);
   }, [tagList, options?.amountPerCategory]);

   return {
      globals,
      newest,
      withMoreSubscribers,
      withMoreBlockers,
      withMoreSubscribersAndBlockersMixed,
      withMostRecentInteraction,
      rest
   };
}

export interface UseTagListDivided {
   globals: Tag[];
   newest: Tag[];
   withMoreSubscribers: Tag[];
   withMoreBlockers: Tag[];
   withMoreSubscribersAndBlockersMixed: Tag[];
   withMostRecentInteraction: Tag[];
   rest: Tag[];
}
