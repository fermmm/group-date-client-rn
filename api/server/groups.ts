import { useCache } from "./../tools/useCache";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { defaultHttpRequest } from "../tools/httpRequest";
import { UseCacheOptions } from "../tools/useCache";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import { Group } from "./shared-tools/endpoints-interfaces/groups";

export function useUserGroupList<T extends Group[]>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useFacebookToken(props?.requestParams?.token);

   return useCache<T>("user/groups", () => defaultHttpRequest("user/groups", "GET", { token }), {
      ...(props?.config ?? {}),
      enabled: token != null && props?.config?.enabled !== false
   });
}
