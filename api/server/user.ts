import { QueryConfig, useQuery } from "react-query";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { getServerUrl } from "../tools/httpRequest";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import { ProfileStatusServerResponse } from "./shared-tools/endpoints-interfaces/user";
import { FileSystemUploadType } from "expo-file-system";
import { RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } from "../../config";

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

export async function uploadImage(
   localUrl: string,
   token: string
): Promise<FileSystem.FileSystemUploadResult> {
   const resizeResult = await ImageManipulator.manipulateAsync(
      localUrl,
      [{ resize: { width: RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
   );

   return await FileSystem.uploadAsync(
      `${getServerUrl()}/user/upload-image?token=${token}`,
      resizeResult.uri,
      {
         uploadType: FileSystemUploadType.MULTIPART,
         fieldName: "image",
         parameters: { token }
      }
   );
}
