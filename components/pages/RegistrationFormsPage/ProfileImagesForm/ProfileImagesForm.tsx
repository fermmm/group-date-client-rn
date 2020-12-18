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
import { currentTheme } from "../../../../config";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import { Menu, Position } from "@breeffy/react-native-popup-menu";
import TitleText from "../../../common/TitleText/TitleText";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import { askForPermission } from "../../../../common-tools/device-native-api/permissions/askForPermissions";
import i18n from "i18n-js";

export interface PropsProfileImagesForm {
   initialData?: { images?: string[] };
   onChange(formData: { images: string[] }, error: string | null): void;
}

const ProfileImagesForm: FC<PropsProfileImagesForm> = ({ initialData, onChange }) => {
   const menuRef = useRef<Menu>();

   /*
    * Refs can hold anything under the "current" property even an array of refs like in this case.
    * Also refs are mutable (as described by the return type name).
    */
   const placeholdersRefs = useRef<TouchableHighlight[]>([]);

   /*
    * With the amount of nulls here you control how many picture can be uploaded.
    * Make sure the support more images.
    */
   const [images, setImages] = useState<string[]>([null, null, null, null, null, null]);
   const [placeholderClicked, setPlaceholderClicked] = useState<number>(null);

   useEffect(() => {
      onChange({ images }, getErrors());
   }, [images]);

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

   const addPicture = (newPicture: string, id: number) => {
      if (newPicture == null) {
         return;
      }

      const result: string[] = [...images];

      for (let i: number = 0; i < result.length; i++) {
         const picture: string = result[i];
         if (picture == null || i === id) {
            result[i] = newPicture;
            setImages(result);
            return;
         }
      }
   };

   const deletePicture = (index: number) => {
      const result: string[] = [...images];
      result.splice(index, 1);
      // This is here to maintain array size:
      result.push(null);
      setImages(result);
   };

   const movePictureToFirstPosition = (index: number) => {
      if (images[index] == null) {
         return;
      }

      const result: string[] = [...images];
      result.unshift(result.splice(index, 1)[0]);
      setImages(result);
   };

   const callImagePicker = async (): Promise<string | null> => {
      // It seems this is unnecessary
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
         quality: 0.8
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
      if (images[0] == null) {
         return "Para que aprobemos tu perfil en la app y puedas usarla, debes subir al menos una foto en la que se te vea";
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
            {images.map((uri, i) => (
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
                  addPicture(await callImagePicker(), placeholderClicked);
               }}
            />
            <PaperMenu.Item
               title="Cámara"
               icon="camera-enhance"
               style={styles.menuItem}
               onPress={async () => {
                  hideMenu();
                  addPicture(await callCameraPicture(), placeholderClicked);
               }}
            />
            {placeholderClicked != null && placeholderClicked !== 0 && images[placeholderClicked] && (
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
            {placeholderClicked != null && images[placeholderClicked] && (
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
