import React, { Component } from "react";
import { StyleSheet, View, TouchableHighlight, Image, ImageStyle, ImageBackground, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { askForPermissions } from "../../../../common-tools/device-native-api/permissions/askForPermissions";
import { withTheme, Menu as PaperMenu } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentTheme } from "../../../../config";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import Menu, { Position } from "react-native-enhanced-popup-menu";
import TitleText from "../../../common/TitleText/TitleText";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";

export interface ProfilePictureFormProps extends Themed {
   onChange(pictures: string[], error: string | null): void;
}
export interface ProfilePictureFormState {
   placeholderClicked: number;
   pictures: string[];
}

class ProfilePictureForm extends Component<ProfilePictureFormProps, ProfilePictureFormState> {
   static defaultProps: Partial<ProfilePictureFormProps> = {};
   placeholdersRefs: TouchableHighlight[] = [];
   menuRef: Menu;
   state: ProfilePictureFormState = {
      placeholderClicked: null,
      pictures: [    // With this line you control how many picture placeholder can be
         null,
         null,
         null,
         null,
         null,
         null,
      ]
   };
   
   componentDidMount(): void {
      this.props.onChange(this.state.pictures, this.getErrors());
   }

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { pictures, placeholderClicked }: ProfilePictureFormState = this.state;

      return (
         <>
            <View style={styles.topContainer}>
               <TitleText extraMarginLeft extraSize>
                  Tus fotos
               </TitleText>
               <TitleSmallText style={styles.titleSmall}>
                  Si irías acompañade a las citas no te olvides de poner fotos de tus acompañantes.
               </TitleSmallText>
            </View>
            <View style={styles.picturesContainer}>
               {
                  this.state.pictures.map((uri, i) =>
                     <TouchableHighlight
                        onPress={() => this.setState({ placeholderClicked: i }, () => this.showMenu())}
                        style={styles.pictureContainer}
                        underlayColor="white"
                        activeOpacity={0.6}
                        ref={c => this.placeholdersRefs[i] = c}
                        key={i}
                     >
                        <SurfaceStyled style={[styles.pictureSurface, uri != null && {backgroundColor: "black"}]}>
                           {
                              uri != null ?
                                 <ImageBackground
                                    style={{width: "100%", height: "100%" }}
                                    source={{uri}}
                                    blurRadius={Platform.OS === "ios" ? 120 : 60}
                                 >
                                    <Image 
                                       source={{uri}} 
                                       resizeMode={"contain"}
                                       style={styles.pictureImage as ImageStyle} 
                                    />
                                 </ImageBackground>
                                 :
                                 <Icon
                                    name={"plus-circle-outline"}
                                    color={currentTheme.colors.primary}
                                    style={{ fontSize: 60 }}
                                 />
                           }
                        </SurfaceStyled>
                     </TouchableHighlight>
                  )
               }
            </View>
            <Menu ref={c => this.menuRef = c}>
               <PaperMenu.Item
                  title="Elegir de tus fotos"
                  icon="photo-library"
                  style={styles.menuItem}
                  onPress={async () => {
                     this.hideMenu();
                     this.addPicture(await this.callImagePicker(), placeholderClicked);
                  }}
               />
               <PaperMenu.Item
                  title="Cámara"
                  icon="camera-enhance"
                  style={styles.menuItem}
                  onPress={async () => {
                     this.hideMenu();
                     this.addPicture(await this.callCameraPicture(), placeholderClicked);
                  }}
               />
               {
                  (placeholderClicked != null && placeholderClicked !== 0 && pictures[placeholderClicked]) &&
                  <PaperMenu.Item
                     title="Mover al principio"
                     icon="arrow-upward"
                     style={styles.menuItem}
                     onPress={() => {
                        this.hideMenu();
                        this.movePictureToFirstPosition(placeholderClicked);
                     }}
                  />
               }
               {
                  (placeholderClicked != null && pictures[placeholderClicked]) &&
                  <PaperMenu.Item
                     title="Eliminar"
                     icon="delete"
                     style={styles.menuItem}
                     onPress={() => {
                        this.hideMenu();
                        this.deletePicture(placeholderClicked);
                     }}
                  />
               }
            </Menu>
         </>
      );
   }

   hideMenu(): void {
      this.menuRef.hide();
   }

   showMenu(): void {
      this.menuRef.show(this.placeholdersRefs[this.state.placeholderClicked], Position.TOP_LEFT, { left: 0, top: 20 });
   }

   addPicture(newPicture: string, id: number): void {
      if (newPicture == null) {
         return;
      }

      const { pictures }: ProfilePictureFormState = this.state;
      const result: string[] = [...pictures];

      for (let i: number = 0; i < result.length; i++) {
         const picture: string = result[i];
         if (picture == null || i === id) {
            result[i] = newPicture;
            this.setState({ pictures: result }, () => this.props.onChange(pictures, this.getErrors()));
            return;
         }
      }
   }

   deletePicture(index: number): void {
      const { pictures }: ProfilePictureFormState = this.state;
      const result: string[] = [...pictures];
      result.splice(index, 1);
      result.push(null);
      this.setState({ pictures: result }, () => this.props.onChange(pictures, this.getErrors()));
   }

   movePictureToFirstPosition(index: number): void {
      if (this.state.pictures[index] == null) {
         return;
      }
      
      const { pictures }: ProfilePictureFormState = this.state;

      const result: string[] = [...pictures];
      result.unshift(result.splice(index, 1)[0]);
      this.setState({ pictures: result }, () => this.props.onChange(pictures, this.getErrors()));
   }

   async callImagePicker(): Promise<string | null> {
      // It seems this is unnecesary
      // await askForPermissions(Permissions.CAMERA_ROLL, {
      //    rejectedDialogTexts: {
      //       dialogTitle: "Error",
      //       dialogText: "Tenes que aceptar permisos para continuar. Cualquier app necesita acceder a tu almacenamiento para que puedas elegir una foto",
      //       openSettingsButtonText: "Modificar permisos",
      //       exitAppButtonText: "Salir de la app",
      //       instructionsToastText: `Toca "Permisos" y activa "Almacenamiento"`,
      //    }
      // });

      const result: ImageInfo = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         quality: 0.8
      }) as unknown as ImageInfo;

      return Promise.resolve(result.uri || null);
   }

   async callCameraPicture(): Promise<string | null> {
      await askForPermissions(Permissions.CAMERA, {
         rejectedDialogTexts: {
            dialogTitle: "Error",
            dialogText: "Tenes que aceptar permisos para continuar. Cualquier app necesita acceder a la cámara para que puedas sacar una foto",
            openSettingsButtonText: "Modificar permisos",
            exitAppButtonText: "Salir de la app",
            instructionsToastText: `Toca "Permisos" y activa "Cámara"`,
         }
      });

      const result: ImageInfo = await ImagePicker.launchCameraAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         quality: 0.8
      }) as unknown as ImageInfo;

      return Promise.resolve(result.uri || null);
   }

   getErrors(): string | null {
      const { pictures }: ProfilePictureFormState = this.state;

      if (pictures[0] == null) {
         return "Tenés que subir al menos una foto para continuar";
      }

      return null;
   }
}

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
      height: "100%",
   },
   menuItem: {
      flex: 1,
   },
});

interface ImageInfo {
   uri: string;
   width: number;
   height: number;
   type?: "image" | "video";
   cancelled: boolean;
}

export default withTheme(ProfilePictureForm);
