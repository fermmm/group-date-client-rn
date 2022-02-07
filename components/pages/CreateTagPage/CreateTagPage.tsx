import React, { FC, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useServerInfo } from "../../../api/server/server-info";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import { createTag, sendTags, TagEditAction } from "../../../api/server/tags";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import { useCustomBackButtonAction } from "../../../common-tools/device-native-api/hardware-buttons/useCustomBackButtonAction";
import { formValidators } from "../../../common-tools/forms/formValidators";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { humanizeUnixTime } from "../../../common-tools/strings/humanizeUnixTime";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import CheckboxButton from "../../common/CheckboxButton/CheckboxButton";
import Dialog from "../../common/Dialog/Dialog";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import TagChip from "../../common/TagChip/TagChip";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import TitleText from "../../common/TitleText/TitleText";
import { TAGS_BANNED_WORDS, TAGS_CATEGORIES } from "../../../config";
import { textContainsAnyWord } from "../../../common-tools/strings/textContainsWord";
import Picker from "../../common/Picker/Picker";

const CreateTagPage: FC = () => {
   const [name, setName] = useState("");
   const [subName, setSubName] = useState("");
   const [category, setCategory] = useState("");
   const [tag, setTag] = useState<Partial<Tag>>({});
   const [exitDialogVisible, setExitDialogVisible] = useState(false);
   const [errorDialogVisible, setErrorDialogVisible] = useState(false);
   const [subscribeChecked, setSubscribeChecked] = useState(true);
   const { token } = useAuthentication();
   const { goBack } = useNavigation();
   const { data: serverInfo } = useServerInfo();
   const categoryOptions = useMemo(
      () => TAGS_CATEGORIES.map((option, i) => ({ label: option, value: i })),
      []
   );

   const getCharactersError = (
      text: string,
      options?: { optional?: boolean; minCharacters?: number; maxCharacters?: number }
   ) => {
      const minCharactersAllowed = options?.minCharacters ?? 2;
      const maxCharactersAllowed = options?.maxCharacters ?? 32;

      if (!text && !options?.optional) {
         return "Debes completar este campo";
      }

      if (text.length < minCharactersAllowed && text.length > 0) {
         return `Debes escribir al menos ${minCharactersAllowed} caracteres`;
      }

      if (text.length > maxCharactersAllowed) {
         return `Te has pasado del máximo de caracteres permitidos por ${
            text.length - maxCharactersAllowed
         } caracteres`;
      }

      return null;
   };

   const getFormError = () => {
      const nameError = getCharactersError(name);
      const categoryError = getCharactersError(category);

      if (nameError != null) {
         return "Campo nombre: " + nameError;
      }

      if (categoryError != null) {
         return "Campo categoría: " + categoryError;
      }

      return null;
   };

   const handleSavePress = async () => {
      if (getFormError()) {
         setErrorDialogVisible(true);
         return;
      }

      goBack();

      if (textContainsAnyWord(tag.name, TAGS_BANNED_WORDS)) {
         return;
      }

      const tagCrated = await createTag(
         { token, name: tag.name, category: tag.category },
         { feedbackText: "Tag creado" }
      );

      if (subscribeChecked) {
         sendTags({ action: TagEditAction.Subscribe, tagIds: [tagCrated.tagId], token });
      }
   };

   const handleBackPress = useCustomBackButtonAction(() => {
      if (getFormError()) {
         goBack();
         return true;
      }

      setExitDialogVisible(true);
      return true;
   }, [name, category, subName]);

   useEffect(() => {
      setTag({
         name: `${name}${subName ? ": " + subName : ""}`,
         category: category
      });
   }, [name, category, subName]);

   return (
      <>
         <AppBarHeader />
         {serverInfo != null && (
            <HelpBanner
               showCloseButton
               rememberClose
               text={`Puedes publicar hasta ${
                  serverInfo.serverConfigurations?.tagsPerTimeFrame
               } tags cada ${humanizeUnixTime(
                  serverInfo.serverConfigurations?.tagCreationTimeFrame
               )}`}
            />
         )}
         <BasicScreenContainer
            showBottomGradient
            showContinueButton
            continueButtonTextFinishMode
            onContinuePress={handleSavePress}
            onBackPress={handleBackPress}
         >
            <View style={styles.mainContainer}>
               <TitleText style={styles.title}>Nombre del tag</TitleText>
               <TextInputExtended
                  errorText={getCharactersError(name)}
                  value={name}
                  onChangeText={t => setName(formValidators.tagName(t).result.text)}
               />
               <TitleText style={styles.title}>Sub-nombre (opcional)</TitleText>
               <TextInputExtended
                  title="Extiende el nombre, por ejemplo con nombre: 'Bailar' y sub-nombre: 'no me gusta' queda: 'Bailar: no me gusta'. Este campo permite emojis."
                  errorText={getCharactersError(subName, { optional: true, minCharacters: 0 })}
                  value={subName}
                  onChangeText={t => setSubName(t)}
               />
               <TitleText style={styles.title}>Categoría</TitleText>
               <Picker
                  items={categoryOptions}
                  value={TAGS_CATEGORIES.indexOf(category)}
                  onChange={itemValue =>
                     setCategory(itemValue !== 0 ? TAGS_CATEGORIES[itemValue] : "")
                  }
               />
               {name != null && name != "" && (
                  <>
                     <TitleText style={styles.title}>Vista previa</TitleText>
                     <View style={styles.tagPreviewContainer}>
                        <TagChip
                           tag={tag as Tag}
                           interactive={false}
                           showSubscribersAmount={false}
                           hideCategory={true}
                           style={styles.tagPreview}
                        />
                     </View>
                  </>
               )}
               <CheckboxButton
                  checked={subscribeChecked}
                  onPress={() => setSubscribeChecked(!subscribeChecked)}
               >
                  <Text>Subscribirme</Text>
               </CheckboxButton>
            </View>
         </BasicScreenContainer>
         <Dialog
            visible={exitDialogVisible}
            onDismiss={() => setExitDialogVisible(false)}
            buttons={[
               { label: "Descartar", onTouch: goBack },
               { label: "Crear tag", onTouch: handleSavePress }
            ]}
         >
            ¿Guardar cambios?
         </Dialog>
         <Dialog visible={errorDialogVisible} onDismiss={() => setErrorDialogVisible(false)}>
            {getFormError()}
         </Dialog>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20,
      paddingTop: 10
   },
   title: {
      marginBottom: 20
   },
   categoryPicker: {
      marginBottom: 20
   },
   tagPreviewContainer: {
      alignItems: "center",
      transform: [{ scale: 1.1 }],
      marginBottom: 10
   },
   tagPreview: {
      elevation: 3
   }
});

export default CreateTagPage;
