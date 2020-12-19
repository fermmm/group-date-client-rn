import { QueryConfig, useQuery } from "react-query";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { AxiosRequestConfigExtended, httpRequest } from "../tools/httpRequest";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import {
   FileUploadResponse,
   ProfileStatusServerResponse
} from "./shared-tools/endpoints-interfaces/user";

export function useServerProfileStatus<T = ProfileStatusServerResponse>(
   requestParams?: TokenParameter,
   config?: QueryConfig<T>
) {
   const storedToken = useFacebookToken();
   const { token } = requestParams ?? storedToken;
   const extraConfig: QueryConfig<T> = token == null ? { enabled: false } : {};

   const query = useQuery<T>(["user/profile-status", "GET", { token }], defaultRequestFunction, {
      ...config,
      ...extraConfig
   });

   return defaultErrorHandler(query);
}

export async function uploadImage(localUrl: string, token: string): Promise<FileUploadResponse> {
   const data = new FormData();
   data.append("image", localUrl);

   const axiosObject: AxiosRequestConfigExtended = {
      url: "user/upload-image",
      method: "POST",
      params: { token },
      data,
      headers: { "Content-Type": "multipart/form-data" },
      handleErrors: true
   };

   return httpRequest<FileUploadResponse>(axiosObject);
}
