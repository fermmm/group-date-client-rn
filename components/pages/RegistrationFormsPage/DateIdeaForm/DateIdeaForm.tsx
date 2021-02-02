import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import { currentTheme } from "../../../../config";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import { RegistrationFormName } from "../tools/useRequiredFormList";

export interface PropsDateIdeaForm {
   formName: RegistrationFormName;
   initialData?: { dateIdea?: string };
   onChange(
      formName: RegistrationFormName,
      formData: { dateIdea: string },
      error: string | null
   ): void;
}

const DateIdeaForm: FC<PropsDateIdeaForm> = ({ onChange, initialData, formName }) => {
   const maxCharactersAllowed: number = 300;
   const [dateIdea, setDateIdea] = useState(initialData?.dateIdea);

   useEffect(() => onChange(formName, { dateIdea }, getError()), [dateIdea]);

   const getError = (): string => {
      if (!dateIdea || dateIdea.length < 3) {
         return "Tienes que escribir una idea válida, es importante para que todxs tengamos una mejor experiencia";
      }

      if (dateIdea.length > maxCharactersAllowed) {
         return (
            "Te has pasado del máximo de caracteres permitidos por " +
            (dateIdea.length - maxCharactersAllowed) +
            " caracteres"
         );
      }

      return null;
   };

   return (
      <View style={styles.mainContainer}>
         <TitleText>¿Dónde te gustaría que fuese una cita grupal?</TitleText>
         <TitleSmallText style={styles.titleSmall}>
            Todxs conocemos algún lugar público agradable.
         </TitleSmallText>
         <EmptySpace height={16} />
         <TextInputExtended
            titleLine2='Ejemplo: "Merienda en la playa"'
            errorText={getError()}
            mode="outlined"
            value={dateIdea}
            onChangeText={setDateIdea}
         />
         <View style={{ flex: 1 }} />
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20,
      justifyContent: "flex-end"
   },
   titleSmall: {
      paddingLeft: 0
   },
   label: {
      marginTop: 30,
      marginBottom: 0
   },
   labelLine2: {
      marginBottom: 0,
      fontFamily: currentTheme.font.extraLight
   },
   ageSelector: {
      marginLeft: 5
   }
});

export default React.memo(DateIdeaForm);
