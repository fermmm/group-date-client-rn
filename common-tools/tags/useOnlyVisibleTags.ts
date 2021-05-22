import { useMemo } from "react";
import { Tag, TagBasicInfo } from "../../api/server/shared-tools/endpoints-interfaces/tags";

export function useOnlyVisibleTags<T extends TagBasicInfo>(tags: T[]): T[] {
   return useMemo(() => tags?.filter(tag => tag.visible !== false), [tags]);
}
