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
   Notification,
   ReportUserPostParams,
   DeleteAccountPostParams,
   DeleteAccountResponse,
   SetSeenPostParams,
   SetSeenResponse,
   TaskCompletedPostParams,
   TaskCompletedResponse,
   BlockOrUnblockUserParams,
   Question
} from "./shared-tools/endpoints-interfaces/user";
import { FileSystemUploadType } from "expo-file-system";
import { IMAGE_QUALITY_WHEN_UPLOADING, RESIZE_IMAGE_BEFORE_UPLOADING_TO_WIDTH } from "../../config";
import { Alert } from "react-native";
import { defaultHttpRequest, getServerUrl } from "../tools/httpRequest";
import { showRequestErrorAlert } from "../tools/showRequestErrorAlert";
import { analyticsLogUser } from "../../common-tools/analytics/tools/analyticsLogUser";

export function useUserProfileStatus<T extends ProfileStatusServerResponse>(props?: {
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
      async () => {
         const resp = await defaultHttpRequest<unknown, T>("user", "GET", {
            ...(props?.requestParams ?? {}),
            token
         });
         // If It's local user then send to analytics
         if (props?.requestParams?.userId == null) {
            analyticsLogUser(resp);
         }
         return resp;
      },
      {
         ...(props?.config ?? {}),
         enabled: token != null && props?.config?.enabled !== false
      }
   );
}

export function useQuestions<T extends Question[]>(props?: { config?: UseCacheOptions<T> }) {
   return useCache<T>(
      "user/questions",
      () => defaultHttpRequest("user/questions", "GET"),
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
      await revalidate("user", { exactMatch: true });
   }
   return resp;
}

export async function sendAttraction(params: SetAttractionParams) {
   return await defaultHttpRequest("user/set-attraction", "POST", params, { handleErrors: true });
}

export async function sendReportUser(params: ReportUserPostParams) {
   return await defaultHttpRequest("user/report", "POST", params, { handleErrors: true });
}

export async function sendBlockUser(params: BlockOrUnblockUserParams) {
   return await defaultHttpRequest("user/block", "POST", params, { handleErrors: true });
}

export async function sendUnblockUser(params: BlockOrUnblockUserParams) {
   return await defaultHttpRequest("user/unblock", "POST", params, { handleErrors: true });
}

export async function setTaskAsCompleted<
   Params = TaskCompletedPostParams,
   Response = TaskCompletedResponse
>(params: Params, autoRevalidateRelated: boolean = true) {
   const response = await defaultHttpRequest<Params, Response>(
      "user/tasks/completed",
      "POST",
      params,
      {
         handleErrors: true
      }
   );

   if (autoRevalidateRelated) {
      await revalidate("user", { exactMatch: true });
   }

   return response;
}

export async function deleteAccount(
   params: DeleteAccountPostParams
): Promise<DeleteAccountResponse> {
   return await defaultHttpRequest("user/delete", "POST", params, { handleErrors: true });
}

export async function setSeen(params: SetSeenPostParams): Promise<SetSeenResponse> {
   return await defaultHttpRequest("user/set-seen", "POST", params, { handleErrors: true });
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
