import { useTags } from "../../../../api/server/tags";

export function useTagsInfo() {
   const { data: tagsFromServer } = useTags();

   const getTagInfoById = (tagId: string) => {
      return tagsFromServer?.find(tag => tag.tagId === tagId);
   };

   return { getTagInfoById };
}
