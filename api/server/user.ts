import i18n from "i18n-js";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { useFacebookToken } from "../third-party/facebook/facebook-login";
import {
   defaultHttpRequest,
   defaultErrorHandler,
   RequestError,
   MutationExtraOptions,
   defaultOptionsForMutations,
   getServerUrl
} from "../tools/reactQueryTools";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import {
   FileUploadResponse,
   ProfileStatusServerResponse,
   SetAttractionParams,
   User,
   UserPostParams,
   UserPropAsQuestion
} from "./shared-tools/endpoints-interfaces/user";
import { FileSystemUploadType } from "expo-file-system";
import { IMAGE_QUALITY_WHEN_UPLOADING, RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } from "../../config";
import { Alert } from "react-native";
import { userQueries } from "./common/queryIds";

export function useServerProfileStatus<T extends ProfileStatusServerResponse>(
   requestParams?: TokenParameter,
   options?: UseQueryOptions<T>
) {
   const { token } = useFacebookToken(requestParams?.token);

   const query = useQuery<T>(
      "user/profile-status",
      () => defaultHttpRequest("user/profile-status", "GET", { token }),
      {
         ...options,
         ...(!token ? { enabled: false } : {})
      }
   );

   return defaultErrorHandler(query);
}

export function useUser<T extends User>(
   requestParams?: TokenParameter,
   options?: UseQueryOptions<T>
) {
   const { token } = useFacebookToken(requestParams?.token);

   const query = useQuery<T>("user", () => defaultHttpRequest("user", "GET", { token }), {
      ...options,
      ...(!token ? { enabled: false } : {})
   });

   return defaultErrorHandler(query);
}

export function usePropsAsQuestions<T = UserPropAsQuestion[]>(options?: UseQueryOptions<T>) {
   const query = useQuery<T>(
      "user/props-as-questions",
      () => defaultHttpRequest("user/props-as-questions", "GET"),
      options
   );

   return defaultErrorHandler(query);
}

export function useUserPropsMutation<T extends UserPostParams, R = void>(
   options: UseMutationOptions<R, RequestError, T> = {},
   extraOptions?: MutationExtraOptions
) {
   let newOptions = defaultOptionsForMutations({
      queriesToInvalidate: userQueries,
      extraOptions,
      options
   });
   return useMutation(data => defaultHttpRequest("user", "POST", data), newOptions);
}

export function useAttractionMutation<T extends SetAttractionParams, R = void>(
   options: UseMutationOptions<R, RequestError, T> = {},
   extraOptions?: MutationExtraOptions
) {
   let newOptions = defaultOptionsForMutations({
      extraOptions,
      options
   });
   return useMutation(data => defaultHttpRequest("user/set-attraction", "POST", data), newOptions);
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
         `ಠ_ಠ ${i18n.t("Error when uploading the image")}`,
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
