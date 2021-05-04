import { revalidate, useCache, UseCacheOptions } from "../tools/useCache/useCache";
import i18n from "i18n-js";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { useAuthentication } from "../authentication/useAuthentication";
import { TokenParameter } from "./shared-tools/endpoints-interfaces/common";
import {
   FileUploadResponse,
   ProfileStatusServerResponse,
   SetAttractionParams,
   User,
   UserGetParams,
   UserPostParams,
   UserPropAsQuestion,
   Notification,
   ReportUserPostParams
} from "./shared-tools/endpoints-interfaces/user";
import { FileSystemUploadType } from "expo-file-system";
import { IMAGE_QUALITY_WHEN_UPLOADING, RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } from "../../config";
import { Alert } from "react-native";
import { defaultHttpRequest, getServerUrl } from "../tools/httpRequest";
import { showRequestErrorAlert } from "../tools/showRequestErrorAlert";

export function useServerProfileStatus<T extends ProfileStatusServerResponse>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);

   return useCache<T>(
      "user/profile-status",
      () => defaultHttpRequest("user/profile-status", "GET", { token }),
      { ...(props?.config ?? {}), enabled: token != null && props?.config?.enabled !== false }
   );
}

export function useUser<T extends User>(props?: {
   requestParams?: Partial<UserGetParams>;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);
   return useCache<T>(
      "user" + (props?.requestParams?.userId ?? ""),
      () => defaultHttpRequest("user", "GET", { ...(props?.requestParams ?? {}), token }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export function usePropsAsQuestions<T = UserPropAsQuestion[]>(props?: {
   config?: UseCacheOptions<T>;
}) {
   return useCache<T>(
      "user/props-as-questions",
      () => defaultHttpRequest("user/props-as-questions", "GET"),
      props?.config
   );
}

export function useNotifications<T extends Notification[]>(props?: {
   requestParams?: TokenParameter;
   config?: UseCacheOptions<T>;
}) {
   const { token } = useAuthentication(props?.requestParams?.token);
   return useCache<T>(
      "user/notifications",
      () =>
         defaultHttpRequest("user/notifications", "GET", {
            token
         }),
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export async function sendUserProps(params: UserPostParams, autoRevalidateRelated: boolean = true) {
   const resp = await defaultHttpRequest("user", "POST", params, { handleErrors: true });
   if (autoRevalidateRelated) {
      revalidate("user");
   }
   return resp;
}

export async function sendAttraction(params: SetAttractionParams) {
   return await defaultHttpRequest("user/set-attraction", "POST", params, { handleErrors: true });
}

export async function sendReportUser(params: ReportUserPostParams) {
   return await defaultHttpRequest("user/report", "POST", params, { handleErrors: true });
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
      showRequestErrorAlert({
         title: i18n.t("Error when uploading the image"),
         retryFn: async () =>
            (retryResult = await uploadImage(resizeResult?.uri ?? localUrl, token, false))
      });
      return retryResult;
   }
}
