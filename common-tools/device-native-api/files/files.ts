// import * as ImagePicker from "expo-image-picker";
// import {
//    ImageInfo,
//    UIImagePickerPresentationStyle
// } from "expo-image-picker/build/ImagePicker.types";
import ImagePicker from "react-native-image-crop-picker";
import { IMAGES_ASPECT_RATIO, LOCK_IMAGES_ASPECT_RATIO } from "../../../config";

export const callImagePicker = async (): Promise<string | null> => {
   // Asking for permission in this case seem to be not needed, if there is any problem enable this code

   //    await askForPermission(
   //       {
   //          getter: () => ImagePicker.getMediaLibraryPermissionsAsync(),
   //          requester: () => ImagePicker.requestMediaLibraryPermissionsAsync()
   //       },
   //       {
   //          rejectedDialogTexts: {
   //             dialogTitle: "Error",
   //             dialogText:
   //                "Tenes que aceptar permisos para continuar. Cualquier app necesita acceder a tu almacenamiento para que puedas elegir una foto",
   //             openSettingsButtonText: "Modificar permisos",
   //             exitAppButtonText: "Salir de la app",
   //             instructionsToastText: `Toca "Permisos" y activa "Almacenamiento"`
   //          }
   //       }
   //    );

   // Currently expo-image-picker has problems on some devices. react-native-image-crop-picker is a better alternative

   // const result: ImageInfo = (await ImagePicker.launchImageLibraryAsync({
   //    mediaTypes: ImagePicker.MediaTypeOptions.Images,
   //    allowsEditing: true,
   //    quality: 1,
   //    presentationStyle: UIImagePickerPresentationStyle.FullScreen,
   //    aspect: LOCK_IMAGES_ASPECT_RATIO ? IMAGES_ASPECT_RATIO : null
   // })) as unknown as ImageInfo;

   // const result = await launchImageLibrary({
   //    mediaType: "photo",
   //    quality: 1
   // });

   const result = await ImagePicker.openPicker({
      mediaType: "photo",
      showCropFrame: true,
      cropping: !LOCK_IMAGES_ASPECT_RATIO,
      freeStyleCropEnabled: true,
      showCropGuidelines: true,
      enableRotationGesture: true,
      hideBottomControls: true,
      cropperToolbarColor: "black",
      cropperToolbarWidgetColor: "white",
      cropperToolbarTitle: "Recortar imagen",
      loadingLabelText: "Cargando",
      cropperChooseText: "Elegir",
      cropperCancelText: "Cancelar",
      cropperTintColor: "white",
      cropperStatusBarColor: "black",
      cropperActiveWidgetColor: "white"
   });

   return Promise.resolve(result?.path ?? null);
};
