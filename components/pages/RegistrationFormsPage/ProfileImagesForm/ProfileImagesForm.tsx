import React, { useEffect, FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { PROFILE_IMAGES_AMOUNT } from "../../../../config";
import TitleText from "../../../common/TitleText/TitleText";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import ImagePlaceholder, { ImagePlaceholderState } from "./ImagePlaceholder/ImagePlaceholder";
import { moveElementInArray } from "../../../../common-tools/js-tools/js-tools";
import { RegistrationFormName } from "../tools/useRequiredFormList";
import { OnChangeFormParams } from "../RegistrationFormsPage";

export interface PropsProfileImagesForm {
   formName: RegistrationFormName;
   initialData?: { images?: string[]; token: string };
   isCoupleProfile: boolean;
   onChange: (props: OnChangeFormParams) => void;
}

const ProfileImagesForm: FC<PropsProfileImagesForm> = props => {
   const { initialData, onChange, formName, isCoupleProfile } = props;
   const [placeholdersState, setPlaceholdersState] = useState<ImagePlaceholderState[]>(
      new Array(PROFILE_IMAGES_AMOUNT).fill(null).map((e, i) => ({
         uri: initialData?.images?.[i] || null,
         isUploading: false,
         id: "ph" + i
      }))
   );
   const [imageToReposition, setImageToReposition] = useState<string>(null);

   useEffect(() => {
      onChange({ formName, newProps: { images: getImagesArray() }, error: getErrors() });
   }, [placeholdersState, formName]);

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
            <TitleText extraMarginLeft>Tus fotos</TitleText>
            {isCoupleProfile && (
               <TitleSmallText style={styles.titleSmall}>
                  No olvides incluir una foto de tu pareja.
               </TitleSmallText>
            )}
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

export default React.memo(ProfileImagesForm);
