import React, { FC, useEffect, useRef, useState } from "react";
import { ImageBackground, Image, ImageStyle, Platform, StyleSheet, View } from "react-native";
import SurfaceStyled from "../../../../common/SurfaceStyled/SurfaceStyled";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Menu, Position } from "@breeffy/react-native-popup-menu";
import { Menu as PaperMenu } from "react-native-paper";
import { Styles } from "../../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../../config";
import { uploadImage } from "../../../../../api/server/user";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../../common/LoadingAnimation/LoadingAnimation";
import { callCameraPicture } from "../../../../../common-tools/device-native-api/camera/camera";
import { callImagePicker } from "../../../../../common-tools/device-native-api/files/files";
import { useTheme } from "../../../../../common-tools/themes/useTheme/useTheme";
import { ViewTouchable } from "../../../../common/ViewTouchable/ViewTouchable";
import { useImageFullUrl } from "../../../../../api/tools/useImageFullUrl";

interface PropsImagePlaceholder {
   initialUri: string;
   id: string;
   token: string;
   repositionMode: boolean;
   onChange: (state: ImagePlaceholderState) => void;
   onRepositionModeRequested: (id: string) => void;
   onRepositionSelect: (id: string) => void;
   onImageDeleted: (id: string) => void;
}

export interface ImagePlaceholderState {
   uri: string | null;
   isUploading: boolean;
   id: string;
}

const ImagePlaceholder: FC<PropsImagePlaceholder> = props => {
   const {
      initialUri,
      token,
      repositionMode,
      onChange,
      onRepositionModeRequested,
      onRepositionSelect,
      onImageDeleted
   } = props;
   const { getImageFullUrl, isLoading: fullUrlLoading } = useImageFullUrl();
   const { colors } = useTheme();
   const [uri, setUri] = useState(initialUri);
   const [fullUri, setFullUri] = useState(null);
   const [imageSize, setImageSize] = useState<{ width: number; height: number }>(null);
   const [id] = useState(props.id);
   const [isUploading, setIsUploading] = useState(false);
   const touchableRef = useRef<View>(null);
   const menuRef = useRef<Menu>(null);

   useEffect(() => onChange({ uri, isUploading, id }), [uri, isUploading]);

   // Effect to load the initial uri from the params when everything is ready for that
   useEffect(() => {
      if (fullUri == null && initialUri && !fullUrlLoading) {
         setFullUri(getImageFullUrl(initialUri));
      }
   }, [initialUri, fullUrlLoading, fullUri]);

   const handleTouch = () => {
      if (!repositionMode) {
         showMenu();
      } else {
         if (uri) {
            onRepositionSelect(id);
         }
      }
   };

   const showMenu = () => {
      if (isUploading) {
         return;
      }

      menuRef.current.show(touchableRef.current, Position.TOP_LEFT, {
         left: 0,
         top: 50
      });
   };

   const hideMenu = () => {
      menuRef.current.hide();
   };

   const handleAddImage = async (source: "camera" | "gallery") => {
      hideMenu();
      let localUrl: string =
         source === "gallery" ? await callImagePicker() : await callCameraPicture();

      if (localUrl == null) {
         return;
      }

      setIsUploading(true);
      const uploadResponse = await uploadImage(localUrl, token);

      if (uploadResponse.isError) {
         setIsUploading(false);
         return;
      }

      const finalFullUri = getImageFullUrl(uploadResponse.data.fileNameBig);

      // This helps with the image catching
      Image.getSize(
         finalFullUri,
         (width, height) => {
            setImageSize({ width, height });
            setFullUri(finalFullUri);
            setUri(uploadResponse.data.fileNameBig);
            setIsUploading(false);
         },
         () => {
            setIsUploading(false);
         }
      );
   };

   const handleDeleteImage = () => {
      hideMenu();
      setUri(null);
      setFullUri(null);
      setImageSize(null);
      onImageDeleted(id);
   };

   const handleRepositionModeRequested = () => {
      hideMenu();
      onRepositionModeRequested(id);
   };

   return (
      <>
         <ViewTouchable
            onPress={handleTouch}
            style={styles.imageContainer}
            defaultRippleColor={colors.primary}
         >
            <>
               <View ref={touchableRef} collapsable={false} />
               <SurfaceStyled style={[styles.imageSurface]}>
                  {uri && !isUploading && (
                     <ImageBackground
                        style={[styles.imageBackground, { opacity: repositionMode ? 0.25 : 1 }]}
                        imageStyle={styles.image as ImageStyle}
                        source={{ uri: fullUri }}
                        blurRadius={Platform.OS === "ios" ? 120 : 60}
                     >
                        <Image
                           source={{ uri: fullUri }}
                           resizeMode={"contain"}
                           style={styles.image as ImageStyle}
                        />
                     </ImageBackground>
                  )}
                  {isUploading && (
                     <LoadingAnimation visible centeredMethod={CenteredMethod.Absolute} />
                  )}
                  {!repositionMode && !uri && !isUploading && (
                     <Icon
                        name={"plus-circle-outline"}
                        color={colors.primary}
                        style={styles.imagePlaceholderIcon}
                     />
                  )}
                  {repositionMode && uri && (
                     <Icon
                        name={"selection-ellipse-arrow-inside"}
                        color={colors.accent2}
                        style={styles.imagePlaceholderIcon}
                     />
                  )}
               </SurfaceStyled>
            </>
         </ViewTouchable>
         <Menu ref={menuRef} style={styles.menu}>
            <PaperMenu.Item
               title="Galería"
               icon="account-box-multiple"
               style={styles.menuItem}
               onPress={() => handleAddImage("gallery")}
            />
            <PaperMenu.Item
               title="Cámara"
               icon="camera-enhance"
               style={styles.menuItem}
               onPress={() => handleAddImage("camera")}
            />
            {uri && (
               <PaperMenu.Item
                  title="Posición"
                  icon="arrow-all"
                  style={styles.menuItem}
                  onPress={handleRepositionModeRequested}
               />
            )}
            {uri && (
               <PaperMenu.Item
                  title="Eliminar"
                  icon="delete"
                  style={styles.menuItem}
                  onPress={handleDeleteImage}
               />
            )}
         </Menu>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   imageContainer: {
      width: "50%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: currentTheme.roundnessSmall
   },
   imageSurface: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: currentTheme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      padding: 0
   },
   imageBackground: {
      width: "100%",
      height: "100%",
      borderRadius: currentTheme.roundnessSmall
   },
   image: {
      width: "100%",
      height: "100%",
      borderRadius: currentTheme.roundnessSmall
   },
   menu: {
      borderRadius: currentTheme.roundnessSmall
   },
   imagePlaceholderIcon: {
      position: "absolute",
      fontSize: 60
   },
   menuItem: {
      flex: 1
   }
});

export default ImagePlaceholder;
