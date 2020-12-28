import { useQuery, UseQueryOptions } from "react-query";
import { defaultErrorHandler, defaultRequestFunction } from "../tools/reactQueryTools";
import { ThemesAsQuestion } from "./shared-tools/endpoints-interfaces/themes";

export function useThemesAsQuestions<T = ThemesAsQuestion[]>(options?: UseQueryOptions<T>) {
   const query = useQuery<T>(
      "themes/questions",
      () => defaultRequestFunction("themes/questions", "GET"),
      options
   );

   return defaultErrorHandler(query);
}
