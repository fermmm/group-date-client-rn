import React, { useEffect, FC, useRef, useState } from "react";
import {
   StyleSheet,
   View,
   TouchableHighlight,
   Image,
   ImageStyle,
   ImageBackground,
   Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Menu as PaperMenu } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentTheme, PROFILE_IMAGES_AMOUNT } from "../../../../config";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import { Menu, Position } from "@breeffy/react-native-popup-menu";
import TitleText from "../../../common/TitleText/TitleText";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import { askForPermission } from "../../../../common-tools/device-native-api/permissions/askForPermissions";
import i18n from "i18n-js";
import { uploadImage } from "../../../../api/server/user";

// TODO:

export interface PropsProfileImagesForm {
   initialData?: { images?: string[]; token: string };
   onChange(formData: { images: string[] }, error: string | null): void;
}

const ProfileImagesForm: FC<PropsProfileImagesForm> = ({ initialData, onChange }) => {
   // initialData images in an array with fixed size to the amount of images that can be uploaded
   const initialDataImagesFixedSizeArray = new Array(PROFILE_IMAGES_AMOUNT)
      .fill(null)
      .map((e, i) => initialData?.images?.[i] || null);

   const menuRef = useRef<Menu>();

   /*
    * Refs can hold anything under the "current" property even an array of refs like in this case.
    * Also refs are mutable (as described by the return type name).
    */
   const placeholdersRefs = useRef<TouchableHighlight[]>([]);

   const [placeholderClicked, setPlaceholderClicked] = useState<number>(null);

   /*
    * This array stores images path to the local device, when the image is uploaded it stores the path
    * of the image in the server. The images displayed to the user uses the paths on this array.
    * This array is not sent to the parent because it may contain local paths during uploads.
    */
   const [imagesDisplayed, setImagesDisplayed] = useState<string[]>(
      initialDataImagesFixedSizeArray
   );

   /**
    * When an image is uploaded and we have the server path we add it to this array, this is the array
    * free of local paths that we can send to the parent component to be uploaded.
    */
   const [imagesUploaded, setImagesUploaded] = useState<string[]>(initialDataImagesFixedSizeArray);

   useEffect(() => {
      onChange({ images: imagesUploaded }, getErrors());
   }, [imagesUploaded]);

   const showMenu = (placeholder: number) => {
      placeholder != null &&
         placeholdersRefs &&
         menuRef.current.show(placeholdersRefs?.current[placeholder], Position.TOP_LEFT, {
            left: 0,
            top: 20
         });
   };

   const hideMenu = () => {
      menuRef.current.hide();
   };

   const addPicture = async (source: "camera" | "gallery", placeholderId: number) => {
      let localUrl: string;

      if (source === "gallery") {
         localUrl = await callImagePicker();
      }

      if (source === "camera") {
         localUrl = await callCameraPicture();
      }

      if (localUrl == null) {
         return;
      }

      // TODO: La imagen hay que achicarla aca también antes de mandar, por que el server tiene limite 2mb
      // TODO: Implementar y testear manejo de errores aca que no usa la misma api
      const uploadResponse = await uploadImage(localUrl, initialData.token);

      console.log(uploadResponse);

      // TODO: Esto habria uqe moverlo arriba y tal vez tener un state por cada imagen por que si no
      // vamos a mandar el state que tenemos aca que cuando vuelve el request ya es viejo

      const result: string[] = [...imagesDisplayed];

      for (let i: number = 0; i < result.length; i++) {
         const picture: string = result[i];
         if (picture == null || i === placeholderId) {
            result[i] = localUrl;
            setImagesDisplayed(result);
            return;
         }
      }
   };

   const deletePicture = (placeholderId: number) => {
      const result: string[] = [...imagesDisplayed];
      result.splice(placeholderId, 1);
      // This is here to maintain array size:
      result.push(null);
      setImagesDisplayed(result);
   };

   const movePictureToFirstPosition = (placeholderId: number) => {
      if (imagesDisplayed[placeholderId] == null) {
         return;
      }

      const result: string[] = [...imagesDisplayed];
      result.unshift(result.splice(placeholderId, 1)[0]);
      setImagesDisplayed(result);
   };

   const callImagePicker = async (): Promise<string | null> => {
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
         quality: 0.8,
         aspect: [4, 4] // TODO: Testear esto que esta interesante y si funca agregarlo tambien a la camara
      })) as unknown) as ImageInfo;

      return Promise.resolve(result.uri || null);
   };

   const callCameraPicture = async (): Promise<string | null> => {
      await askForPermission(Permissions.CAMERA, {
         rejectedDialogTexts: {
            instructionsToastText: i18n.t("Touch on Camera")
         }
      });

      const result: ImageInfo = ((await ImagePicker.launchCameraAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         quality: 0.8
      })) as unknown) as ImageInfo;

      return Promise.resolve(result.uri || null);
   };

   const getErrors = (): string | null => {
      if (imagesDisplayed[0] == null) {
         return "Debes subir al menos una foto en la que se te vea, lxs que suban cualquier imagen para hacer trampa no podrán usar más la app. Los perfiles sin foto perjudican a muchos usuarixs, seamos respetuosxs con lxs demás.";
      }

      return null;
   };

   return (
      <>
         <View style={styles.topContainer}>
            <TitleText extraMarginLeft extraSize>
               Tus fotos
            </TitleText>
            <TitleSmallText style={styles.titleSmall}>
               Si irías acompañadx a las citas no olvides subir fotos de tus acompañantes.
            </TitleSmallText>
         </View>
         <View style={styles.picturesContainer}>
            {imagesDisplayed.map((uri, i) => (
               <TouchableHighlight
                  onPress={() => {
                     setPlaceholderClicked(i);
                     showMenu(i);
                  }}
                  style={styles.pictureContainer}
                  underlayColor="white"
                  activeOpacity={0.6}
                  ref={el => (placeholdersRefs.current[i] = el)}
                  key={i}
               >
                  <SurfaceStyled
                     style={[styles.pictureSurface, uri != null && { backgroundColor: "black" }]}
                  >
                     {uri != null ? (
                        <ImageBackground
                           style={{ width: "100%", height: "100%" }}
                           source={{ uri }}
                           blurRadius={Platform.OS === "ios" ? 120 : 60}
                        >
                           <Image
                              source={{ uri }}
                              resizeMode={"contain"}
                              style={styles.pictureImage as ImageStyle}
                           />
                        </ImageBackground>
                     ) : (
                        <Icon
                           name={"plus-circle-outline"}
                           color={currentTheme.colors.primary}
                           style={{ fontSize: 60 }}
                        />
                     )}
                  </SurfaceStyled>
               </TouchableHighlight>
            ))}
         </View>
         <Menu ref={menuRef}>
            <PaperMenu.Item
               title="Elegir de tus fotos"
               icon="account-box-multiple"
               style={styles.menuItem}
               onPress={async () => {
                  hideMenu();
                  addPicture("gallery", placeholderClicked);
               }}
            />
            <PaperMenu.Item
               title="Cámara"
               icon="camera-enhance"
               style={styles.menuItem}
               onPress={async () => {
                  hideMenu();
                  addPicture("camera", placeholderClicked);
               }}
            />
            {placeholderClicked != null &&
               placeholderClicked !== 0 &&
               imagesDisplayed[placeholderClicked] && (
                  <PaperMenu.Item
                     title="Mover al principio"
                     icon="arrow-top-left"
                     style={styles.menuItem}
                     onPress={() => {
                        hideMenu();
                        movePictureToFirstPosition(placeholderClicked);
                     }}
                  />
               )}
            {placeholderClicked != null && imagesDisplayed[placeholderClicked] && (
               <PaperMenu.Item
                  title="Eliminar"
                  icon="delete"
                  style={styles.menuItem}
                  onPress={() => {
                     hideMenu();
                     deletePicture(placeholderClicked);
                  }}
               />
            )}
         </Menu>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   topContainer: {
      marginBottom: 15
   },
   picturesContainer: {
      flexDirection: "row",
      flexWrap: "wrap"
   },
   pictureContainer: {
      width: "50%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 5,
      paddingRight: 5
   },
   pictureSurface: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: currentTheme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      padding: 0
   },
   pictureImage: {
      width: "100%",
      height: "100%"
   },
   menuItem: {
      flex: 1
   }
});

interface ImageInfo {
   uri: string;
   width: number;
   height: number;
   type?: "image" | "video";
   cancelled: boolean;
}

export default ProfileImagesForm;
