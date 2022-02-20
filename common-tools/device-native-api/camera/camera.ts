import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { askForPermission } from "../permissions/askForPermissions";
import i18n from "i18n-js";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { IMAGES_ASPECT_RATIO, LOCK_IMAGES_ASPECT_RATIO } from "../../../config";

export const callCameraPicture = async (): Promise<string | null> => {
   const granted = await askForPermission(
      {
         getter: () => Camera.getCameraPermissionsAsync(),
         requester: () => Camera.requestCameraPermissionsAsync()
      },
      {
         rejectedDialogTexts: {
            instructionsToastText: i18n.t("Touch on Camera")
         }
      }
   );

   if (!granted) {
      return Promise.resolve(null);
   }

   const result: ImageInfo = (await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      presentationStyle: 0,
      aspect: LOCK_IMAGES_ASPECT_RATIO ? IMAGES_ASPECT_RATIO : null
   })) as unknown as ImageInfo;

   return Promise.resolve(result.uri || null);
};
