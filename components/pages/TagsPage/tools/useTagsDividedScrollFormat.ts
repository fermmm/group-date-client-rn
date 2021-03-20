import { useMemo } from "react";
import { Tag } from "../../../../api/server/shared-tools/endpoints-interfaces/tags";
import { UseTagListDivided } from "./useTagListDivided";

export function useTagsDividedScrollFormat(tags: UseTagListDivided): UseTagsDividedScrollFormat[] {
   return useMemo(
      () => [
         {
            title: "Últimos con interacción",
            data: tags.withMostRecentInteraction
         },
         {
            title: "Nuevos",
            data: tags.newest
         },
         {
            title: "Más populares",
            data: tags.withMoreSubscribersAndBlockersMixed
         },
         {
            title: "De los creadores de la app",
            data: tags.globals
         },
         {
            title: "El resto",
            data: tags.rest
         }
      ],
      [tags]
   );
}

export interface UseTagsDividedScrollFormat {
   title?: string;
   data: Tag[];
}
