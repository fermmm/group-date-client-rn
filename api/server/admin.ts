import { defaultHttpRequest } from "../tools/httpRequest";
import { revalidate } from "../tools/useCache";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";

export async function sendCreateFakeUsers(
   params: TokenParameter & { text: string },
   autoRevalidateRelated: boolean = true
) {
   const resp = await defaultHttpRequest<typeof params, string>(
      "testing/create-fake-users",
      "GET",
      params
   );
   if (autoRevalidateRelated) {
      revalidate("cards-game/recommendations");
   }
   return resp;
}
