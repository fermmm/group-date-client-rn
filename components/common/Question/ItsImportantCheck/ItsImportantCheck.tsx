import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Text, Checkbox } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import ListItemImproved from "../../ListItemImproved/ListItemImproved";

interface PropsItsImportantCheck {
   answers: Array<{ text: string }>;
   checked: boolean;
   onChange: (checked: boolean) => void;
   selectedAnswer?: number;
   incompatibilitiesBetweenAnswers?: { [key: number]: number[] };
}

const ItsImportantCheck: FC<PropsItsImportantCheck> = props => {
   const { checked, onChange, answers, selectedAnswer, incompatibilitiesBetweenAnswers } = props;

   if (
      selectedAnswer == null ||
      selectedAnswer === -1 ||
      !incompatibilitiesBetweenAnswers ||
      Object.keys(incompatibilitiesBetweenAnswers).length === 0
   ) {
      return null;
   }

   const incompatibilities: number[] = incompatibilitiesBetweenAnswers?.[selectedAnswer] || null;

   if (!incompatibilities) {
      return <Text style={styles.noFiltersText}>Esta respuesta no se puede usar como filtro</Text>;
   }

   const getIsImportantDescriptionText = () => {
      const incompatibleResponsesText: string[] = answers
         .filter((a, i) => incompatibilities.includes(i))
         .map(a => a.text);

      return (
         <Text style={styles.importantDescriptionTextBold}>
            No mostrarme a quienes responden lo opuesto:
            {incompatibleResponsesText.map((responseText, i) => (
               <Text style={styles.importantDescriptionText} key={i}>
                  {i !== 0 && " ni"} "{responseText}"
               </Text>
            ))}
         </Text>
      );
   };

   return (
      <ListItemImproved
         title="Usar de filtro"
         description={() => getIsImportantDescriptionText()}
         left={() => (
            <Checkbox status={checked && incompatibilities.length > 0 ? "checked" : "unchecked"} />
         )}
         onPress={() => onChange(!checked)}
         disabled={incompatibilities.length === 0}
         style={styles.importantCheck}
      />
   );
};

const styles: Styles = StyleSheet.create({
   importantCheck: {
      marginTop: 50,
      padding: 25
   },
   noFiltersText: {
      marginTop: 50,
      padding: 25,
      fontFamily: currentTheme.font.light,
      fontSize: 13
   },
   importantDescriptionText: {
      fontFamily: currentTheme.font.light,
      fontSize: 13
   },
   importantDescriptionTextBold: {
      fontSize: 14
   }
});

export default ItsImportantCheck;
