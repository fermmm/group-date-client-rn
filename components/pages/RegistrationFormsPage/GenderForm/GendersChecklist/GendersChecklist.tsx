import React, { FC, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import I18n from "i18n-js";
import {
   ALL_GENDERS,
   Gender
} from "../../../../../api/server/shared-tools/endpoints-interfaces/user";
import { IconButton, Text } from "react-native-paper";
import { useTheme } from "../../../../../common-tools/themes/useTheme/useTheme";
import TitleText from "../../../../common/TitleText/TitleText";
import CheckboxButton from "../../../../common/CheckboxButton/CheckboxButton";
import { Styles } from "../../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../../config";

export interface PropsGendersChecklist {
   title: string;
   initiallySelected?: Gender[];
   onChange: (newSelection: Gender[]) => void;
}

const GendersChecklist: FC<PropsGendersChecklist> = props => {
   const { title, initiallySelected, onChange } = props;
   const { colors } = useTheme();
   const [selection, setSelection] = useState<Gender[]>(initiallySelected);
   const cisGenders = [Gender.Woman, Gender.Man];
   const nonCisGenders = useMemo(
      () =>
         ALL_GENDERS.filter(gender => !cisGenders.includes(gender)).sort((a, b) =>
            I18n.t(a).localeCompare(I18n.t(b))
         ),
      []
   );

   const addOrRemoveFromSelection = (gender: Gender) => {
      if (selection.includes(gender)) {
         return setSelection(selection.filter(a => a !== gender));
      } else {
         return setSelection([...selection, gender]);
      }
   };

   useEffect(() => onChange(selection), [selection]);

   return (
      <>
         <TitleText style={styles.question}>{title}</TitleText>
         <View style={styles.helpTextContainer}>
            <IconButton
               icon="help-rhombus"
               size={25}
               color={colors.statusOk}
               style={{ opacity: 0.4 }}
            />
            <TitleText style={styles.helpText}>Se puede seleccionar más de una opción</TitleText>
         </View>
         <View style={styles.responsesContainer}>
            <TitleText style={styles.cisTitleText}>Cis</TitleText>
            {cisGenders.map((gender: Gender) => (
               <CheckboxButton
                  checked={selection.includes(gender)}
                  onPress={() => addOrRemoveFromSelection(gender)}
                  key={gender}
               >
                  <Text style={styles.responseText}>{I18n.t(gender)}</Text>
               </CheckboxButton>
            ))}
            <TitleText style={styles.otherGendersTitleText}>Otros géneros</TitleText>
            {nonCisGenders.map((gender: Gender) => (
               <CheckboxButton
                  checked={selection.includes(gender)}
                  onPress={() => addOrRemoveFromSelection(gender)}
                  key={gender}
               >
                  <Text style={styles.responseText}>{I18n.t(gender)}</Text>
               </CheckboxButton>
            ))}
         </View>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   question: {
      paddingLeft: 10,
      marginBottom: 0
   },
   helpTextContainer: {
      flexDirection: "row",
      marginTop: 8,
      paddingLeft: 5,
      paddingRight: 5,
      alignItems: "center"
   },
   helpText: {
      flex: 1,
      flexWrap: "wrap",
      fontFamily: currentTheme.font.extraLight,
      fontSize: 16,
      marginBottom: 0,
      marginTop: 0
   },
   cisTitleText: {
      flex: 1,
      flexWrap: "wrap",
      fontFamily: currentTheme.font.extraLight,
      fontSize: 16,
      marginBottom: 5,
      marginTop: 0
   },
   otherGendersTitleText: {
      flex: 1,
      flexWrap: "wrap",
      fontFamily: currentTheme.font.extraLight,
      fontSize: 16,
      marginTop: 30,
      marginBottom: 5
   },
   responsesContainer: {
      marginTop: 15,
      paddingLeft: 15,
      paddingRight: 15
   },
   responseText: {
      fontSize: 17
   }
});

export default GendersChecklist;
