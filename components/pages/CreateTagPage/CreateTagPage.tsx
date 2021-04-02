import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Tag } from "../../../api/server/shared-tools/endpoints-interfaces/tags";
import { formValidators } from "../../../common-tools/forms/formValidators";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TagChip from "../../common/TagChip/TagChip";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import TitleText from "../../common/TitleText/TitleText";

// TODO:
// - Dialogo de guardar cambios al apretar en atrás
// - Mensaje con los limites
// - Convertir categorías en una lista por que da ideas
// - Lógica de enviar

const CreateTagPage: FC = () => {
   const [name, setName] = useState("");
   const [subName, setSubName] = useState("");
   const [category, setCategory] = useState("");
   const [tag, setTag] = useState<Partial<Tag>>({});

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

   useEffect(() => {
      setTag({
         name: `${name}${subName ? ": " + subName : ""}`,
         category: category
      });
   }, [name, category, subName]);

   return (
      <>
         <AppBarHeader />
         <BasicScreenContainer
            showBottomGradient={true}
            showContinueButton
            continueButtonTextFinishMode
         >
            <View style={styles.mainContainer}>
               <TitleText style={styles.title}>Nombre</TitleText>
               <TextInputExtended
                  errorText={getCharactersError(name)}
                  value={name}
                  onChangeText={t => setName(formValidators.tagName(t).result.text)}
               />
               <TitleText style={styles.title}>Sub-nombre (opcional)</TitleText>
               <TextInputExtended
                  title="Se incluye en el nombre final, ejemplo: Nombre: 'Ciudades' Sub-nombre: 'no me gustan' queda: 'Ciudades: no me gustan'. Este campo permite emojis."
                  errorText={getCharactersError(subName, { optional: true, minCharacters: 0 })}
                  value={subName}
                  onChangeText={t => setSubName(t)}
               />
               <TitleText style={styles.title}>Categoría</TitleText>
               <TextInputExtended
                  title="Sirve para agrupar tags en algunas listas"
                  errorText={getCharactersError(category)}
                  value={category}
                  onChangeText={t => setCategory(formValidators.tagCategory(t).result.text)}
               />
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
            </View>
         </BasicScreenContainer>
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
   tagPreviewContainer: {
      alignItems: "center",
      transform: [{ scale: 1.1 }]
   },
   tagPreview: {
      elevation: 3
   }
});

export default CreateTagPage;
