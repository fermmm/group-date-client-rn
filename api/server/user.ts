import i18n from "i18n-js";
import { useQuery, UseQueryOptions } from "react-query";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import { getServerUrl } from "../tools/httpRequest";
import { defaultRequestFunction, defaultErrorHandler } from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import {
   FileUploadResponse,
   ProfileStatusServerResponse,
   UserPropAsQuestion
} from "./shared-tools/endpoints-interfaces/user";
import { FileSystemUploadType } from "expo-file-system";
import { IMAGE_QUALITY_WHEN_UPLOADING, RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } from "../../config";
import { Alert } from "react-native";

export function useServerProfileStatus<T = ProfileStatusServerResponse>(
   requestParams?: TokenParameter,
   options?: UseQueryOptions<T>
) {
   const storedToken = useFacebookToken();
   const { token } = requestParams ?? storedToken;
   const extraOptions: UseQueryOptions<T> = token == null ? { enabled: false } : {};

   const query = useQuery<T>(
      "user/profile-status",
      () => defaultRequestFunction("user/profile-status", "GET", { token }),
      {
         ...options,
         ...extraOptions
      }
   );

   return defaultErrorHandler(query);
}

export function usePropsAsQuestions<T = UserPropAsQuestion[]>(options?: UseQueryOptions<T>) {
   const query = useQuery<T>(
      "user/props-as-questions",
      () => defaultRequestFunction("user/props-as-questions", "GET"),
      options
   );

   return defaultErrorHandler(query);
}

export async function uploadImage(
   localUrl: string,
   token: string,
   resizeImage?: boolean
): Promise<{ isError: boolean; errorMessage?: string; data?: FileUploadResponse }> {
   resizeImage = resizeImage ?? true;
   let resizeResult: ImageManipulator.ImageResult;

   if (resizeImage) {
      resizeResult = await ImageManipulator.manipulateAsync(
         localUrl,
         [{ resize: { width: RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } }],
         { compress: IMAGE_QUALITY_WHEN_UPLOADING, format: ImageManipulator.SaveFormat.JPEG }
      );
   }

   try {
      const uploadResult = await FileSystem.uploadAsync(
         `${getServerUrl()}user/upload-image?token=${token}`,
         resizeResult?.uri ?? localUrl,
         {
            uploadType: FileSystemUploadType.MULTIPART,
            fieldName: "image",
            parameters: { token }
         }
      );

      if (uploadResult.status !== 200) {
         Alert.alert(
            `ಠ_ಠ ${i18n.t("Unexpected error when uploading image")}:`,
            `${uploadResult.body}.\n\n${i18n.t(
               "If you want you can help by sending us a screen capture of this error"
            )}`,
            [{ text: i18n.t("OK") }],
            { cancelable: true }
         );
         return { isError: true, errorMessage: uploadResult.body };
      } else {
         return { isError: false, data: JSON.parse(uploadResult.body) };
      }
   } catch (error) {
      let retryResult = { isError: true };
      Alert.alert(
         `ಠ_ಠ ${i18n.t("Error subiendo la imagen")}`,
         i18n.t("There seems to be a connection problem"),
         [
            {
               text: i18n.t("Try again"),
               onPress: async () =>
                  (retryResult = await uploadImage(resizeResult?.uri ?? localUrl, token, false))
            },
            {
               text: i18n.t("Cancel")
            }
         ],
         { cancelable: true }
      );
      return retryResult;
   }
}
