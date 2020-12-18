import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import { currentTheme } from "../../../../config";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";

export interface PropsDateIdeaForm {
   initialFormData?: { dateIdea?: string };
   onChange(formData: { dateIdea: string }, error: string | null): void;
}

const DateIdeaForm: FC<PropsDateIdeaForm> = ({ onChange, initialFormData }) => {
   const maxCharactersAllowed: number = 300;
   const [dateIdea, setDateIdea] = useState(initialFormData?.dateIdea);

   useEffect(() => onChange({ dateIdea }, getError()), [dateIdea]);

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
            Improvisa una idea, todxs conocemos algún lugar público agradable.
         </TitleSmallText>
         <TitleSmallText style={styles.titleSmall}>
            Es importante para que funcione mejor la app.
         </TitleSmallText>
         <EmptySpace />
         <TextInputExtended
            title="Nombre del lugar y/o actividad"
            titleLine2='Ejemplo: "Merienda en la playa"'
            multiline
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

export default DateIdeaForm;
