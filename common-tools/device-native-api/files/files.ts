import * as ImagePicker from "expo-image-picker";
import { askForPermission } from "../permissions/askForPermissions";
import i18n from "i18n-js";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { IMAGES_ASPECT_RATIO, LOCK_IMAGES_ASPECT_RATIO } from "../../../config";

export const callImagePicker = async (): Promise<string | null> => {
   // It seems this is unnecessary, after testing with an apk remove this
   // await askForPermissions(Permissions.CAMERA_ROLL, {
   //    rejectedDialogTexts: {
   //       dialogTitle: "Error",
   //       dialogText: "Tenes que aceptar permisos para continuar. Cualquier app necesita acceder a tu almacenamiento para que puedas elegir una foto",
   //       openSettingsButtonText: "Modificar permisos",
   //       exitAppButtonText: "Salir de la app",
   //       instructionsToastText: `Toca "Permisos" y activa "Almacenamiento"`,
   //    }
   // });

   const result: ImageInfo = ((await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: LOCK_IMAGES_ASPECT_RATIO ? IMAGES_ASPECT_RATIO : null
   })) as unknown) as ImageInfo;

   return Promise.resolve(result.uri || null);
};
