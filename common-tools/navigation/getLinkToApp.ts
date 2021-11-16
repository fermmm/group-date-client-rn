import * as Linking from "expo-linking";

export function getLinkToApp(props?: {
   subpath?: string;
   queryParams?: Record<string, string>;
}): string {
   const { subpath = "", queryParams } = props || {};

   return Linking.createURL(subpath, queryParams ? { queryParams } : undefined);
}
