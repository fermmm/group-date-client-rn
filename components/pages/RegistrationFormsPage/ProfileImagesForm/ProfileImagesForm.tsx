import React, { useEffect, FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { PROFILE_IMAGES_AMOUNT } from "../../../../config";
import TitleText from "../../../common/TitleText/TitleText";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import ImagePlaceholder, { ImagePlaceholderState } from "./ImagePlaceholder/ImagePlaceholder";
import { moveElementInArray } from "../../../../common-tools/js-tools/js-tools";

export interface PropsProfileImagesForm {
   initialData?: { images?: string[]; token: string };
   onChange(formData: { images: string[] }, error: string | null): void;
}

const ProfileImagesForm: FC<PropsProfileImagesForm> = ({ initialData, onChange }) => {
   const [placeholdersState, setPlaceholdersState] = useState<ImagePlaceholderState[]>(
      new Array(PROFILE_IMAGES_AMOUNT).fill(null).map((e, i) => ({
         uri: initialData?.images?.[i] || null,
         isUploading: false,
         id: "ph" + i
      }))
   );
   const [imageToReposition, setImageToReposition] = useState<string>(null);

   useEffect(() => {
      onChange({ images: getImagesArray() }, getErrors());
   }, [placeholdersState]);

   const handlePlaceholderChange = (newState: ImagePlaceholderState) => {
      let newPlaceholdersState = [...placeholdersState];
      newPlaceholdersState[getPlaceholderPositionById(newState.id)] = newState;
      newPlaceholdersState = removeGapsFromPlaceholdersList(newPlaceholdersState);
      setPlaceholdersState(newPlaceholdersState);
   };

   const handleRepositionModeStart = (placeholderId: string) => {
      setImageToReposition(placeholderId);
   };

   const handleRepositionSelect = (targetPosition: number) => {
      const newPlaceholdersState = [...placeholdersState];
      moveElementInArray(
         newPlaceholdersState,
         getPlaceholderPositionById(imageToReposition),
         targetPosition
      );
      setPlaceholdersState(newPlaceholdersState);
      setImageToReposition(null);
   };

   const handleRepositionCancel = () => {
      setImageToReposition(null);
   };

   const handleImageDelete = (placeholderId: string) => {
      const newPlaceholdersState = [...placeholdersState];
      moveElementInArray(
         newPlaceholdersState,
         getPlaceholderPositionById(placeholderId),
         placeholdersState.length - 1
      );
      setPlaceholdersState(newPlaceholdersState);
   };

   const getImagesArray = (): string[] => {
      return placeholdersState.filter(state => state.uri).map(state => state.uri);
   };

   const isAnyImageUploading = (): boolean => {
      return !placeholdersState.every(state => state.isUploading === false);
   };

   const getPlaceholderPositionById = (placeholderId: string): number => {
      return placeholdersState.findIndex(p => p.id === placeholderId);
   };

   const removeGapsFromPlaceholdersList = (
      placeholders: ImagePlaceholderState[]
   ): ImagePlaceholderState[] => {
      const placeholdersWithImage = placeholders.filter(state => state.uri);
      const placeholdersWithoutImage = placeholders.filter(state => !state.uri);
      return [...placeholdersWithImage, ...placeholdersWithoutImage];
   };

   const getErrors = (): string | null => {
      if (getImagesArray().length === 0) {
         return "Debes subir al menos una foto en la que se te vea, lxs que suban cualquier imagen para hacer trampa no podrán usar más la app. Los perfiles sin foto perjudican a muchos usuarixs, seamos respetuosxs con lxs demás.";
      }

      if (imageToReposition != null) {
         return "Debes elegir la nueva posición para tu foto.";
      }

      if (isAnyImageUploading()) {
         return "Debes esperar a que terminen de subir todas las fotos para continuar.";
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
         <View style={styles.imagesContainer}>
            {placeholdersState.map((state, i) => (
               <ImagePlaceholder
                  initialUri={state.uri}
                  id={state.id}
                  token={initialData.token}
                  repositionMode={imageToReposition != null}
                  onChange={newState => handlePlaceholderChange(newState)}
                  onRepositionModeRequested={id => handleRepositionModeStart(id)}
                  onRepositionSelect={id => handleRepositionSelect(i)}
                  onImageDeleted={id => handleImageDelete(id)}
                  key={state.id}
               />
            ))}
         </View>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   topContainer: {
      marginBottom: 15
   },
   imagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap"
   }
});

export default ProfileImagesForm;
