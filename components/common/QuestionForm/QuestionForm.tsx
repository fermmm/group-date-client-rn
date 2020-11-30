import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Checkbox, IconButton } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import TitleText from "../TitleText/TitleText";
import RadioButtonImproved from "../RadioButtonImproved/RadioButtonImproved";
import { currentTheme } from "../../../config";
import CheckboxButton from "../../common/CheckboxButton/CheckboxButton";
import ListItemImproved from "../ListItemImproved/ListItemImproved";
import {
   QuestionAnswerData,
   ThemesAsQuestion
} from "../../../api/server/shared-tools/endpoints-interfaces/themes";
import { checkTypeByMember } from "../../../common-tools/ts-tools/common-ts-tools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import {
   UserPropAsQuestion,
   UserPropAsQuestionAnswer,
   UserPropsAsQuestionsTypes
} from "../../../api/server/shared-tools/endpoints-interfaces/user";

export interface QuestionProps {
   questionData: Question;
   selectedAnswers?: Answer[];
   itsImportantChecked?: boolean;
   onChange?(selectedAnswers: Answer[], itsImportantSelected: boolean): void;
}

const QuestionForm: FC<QuestionProps> = props => {
   const { questionData, onChange } = props;
   const [selectedAnswers, setSelectedAnswers] = useState(props.selectedAnswers ?? []);
   const [itsImportantChecked, setItsImportantChecked] = useState(
      props.itsImportantChecked ?? false
   );
   const { colors } = useTheme();

   const incompatibilitiesBetweenAnswers =
      "incompatibilitiesBetweenAnswers" in questionData
         ? questionData.incompatibilitiesBetweenAnswers
         : null;

   const extraText = "extraText" in questionData ? questionData.extraText : null;
   const multipleAnswersAllowed =
      "multipleAnswersAllowed" in questionData ? questionData.multipleAnswersAllowed : null;

   const answers: Array<UserPropAsQuestionAnswer<UserPropsAsQuestionsTypes> | QuestionAnswerData> =
      questionData.answers;

   const incompatibilitiesPresent: boolean =
      incompatibilitiesBetweenAnswers != null && incompatibilitiesBetweenAnswers !== {};

   useEffect(() => {
      if (onChange != null) {
         onChange(selectedAnswers, itsImportantChecked);
      }
   }, [selectedAnswers, itsImportantChecked]);

   const getAnswerPositionOnList = (answersList: Answer[], answer: Answer) => {
      if (answersList == null) {
         return -1;
      }

      return answersList.findIndex(a => {
         if (checkTypeByMember<QuestionAnswerData>(answer, "themeId")) {
            return answer.themeId === (a as QuestionAnswerData).themeId;
         } else {
            if (answer.propName != null) {
               return (
                  answer.propName ===
                  (a as UserPropAsQuestionAnswer<UserPropsAsQuestionsTypes>).propName
               );
            } else {
               return (
                  answer.value === (a as UserPropAsQuestionAnswer<UserPropsAsQuestionsTypes>).value
               );
            }
         }
      });
   };

   const addAnswersToList = (answersList: Answer[], answer: Answer) => {
      return [...answersList, answer];
   };

   const removeAnswerFromList = (answersList: Answer[], answer: Answer) => {
      const result = [...answersList];
      result.splice(getAnswerPositionOnList(answersList, answer), 1);
      return result;
   };

   const toggleAnswerFromList = (answersList: Answer[], answer: Answer) => {
      if (getAnswerPositionOnList(answersList, answer) !== -1) {
         return removeAnswerFromList(answersList, answer);
      } else {
         return addAnswersToList(answersList, answer);
      }
   };

   const getIsImportantDescriptionText = () => {
      const incompatibleAnswers: Answer[] = getIncompatibleResponses();
      const incompatibleResponsesText: string[] = incompatibleAnswers.map(a => a.text);

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

   const getIncompatibleResponses = () => {
      const result: Answer[] = [];
      if (incompatibilitiesBetweenAnswers == null) {
         return result;
      }

      selectedAnswers.forEach((answer, i) => {
         if (incompatibilitiesBetweenAnswers[i] != null) {
            incompatibilitiesBetweenAnswers[i].forEach(incompatibleAnswerIndex =>
               result.push(answers[incompatibleAnswerIndex])
            );
         }
      });

      return result;
   };

   return (
      <>
         <TitleText style={styles.question}>{questionData.text}</TitleText>
         {extraText != null && <TitleText style={styles.questionExtraText}>{extraText}</TitleText>}
         {multipleAnswersAllowed && (
            <View style={styles.helpTextContainer}>
               <IconButton
                  icon="help-rhombus"
                  size={25}
                  color={colors.statusOk}
                  style={{ opacity: 0.4 }}
               />
               <TitleText style={styles.helpText}>Se puede seleccionar más de una opción</TitleText>
            </View>
         )}
         <View style={styles.responsesContainer}>
            {multipleAnswersAllowed === true
               ? answers.map((answer: Answer, i) => (
                    <CheckboxButton
                       checked={getAnswerPositionOnList(selectedAnswers, answer) !== -1}
                       onPress={() =>
                          setSelectedAnswers(toggleAnswerFromList(selectedAnswers, answer))
                       }
                       key={i}
                    >
                       <Text style={styles.responseText}>{answer.text}</Text>
                       {extraText != null && (
                          <Text style={styles.responseExtraText}>
                             {"  "}
                             {extraText}
                          </Text>
                       )}
                    </CheckboxButton>
                 ))
               : answers.map((answer, i) => (
                    <RadioButtonImproved
                       checked={getAnswerPositionOnList(selectedAnswers, answer) !== -1}
                       onPress={() => setSelectedAnswers([answer])}
                       key={i}
                    >
                       <Text style={styles.responseText}>{answer.text}</Text>
                       {extraText != null && (
                          <Text style={styles.responseExtraText}>
                             {"  "}
                             {extraText}
                          </Text>
                       )}
                    </RadioButtonImproved>
                 ))}
         </View>
         {selectedAnswers.length > 0 &&
         incompatibilitiesPresent &&
         getIncompatibleResponses().length > 0 ? (
            <ListItemImproved
               title="Usar de filtro"
               description={() => getIsImportantDescriptionText()}
               left={() => (
                  <Checkbox
                     status={
                        itsImportantChecked && getIncompatibleResponses().length > 0
                           ? "checked"
                           : "unchecked"
                     }
                  />
               )}
               onPress={() => setItsImportantChecked(!itsImportantChecked)}
               disabled={getIncompatibleResponses().length === 0}
               style={styles.importantCheck}
            />
         ) : (
            selectedAnswers.length > 0 &&
            incompatibilitiesPresent &&
            getIncompatibleResponses().length === 0 && (
               <Text style={styles.noFiltersText}>
                  Con esa respuesta nadie te va a filtrar ni tampoco podes filtrar
               </Text>
            )
         )}
      </>
   );
};

const styles: Styles = StyleSheet.create({
   question: {
      fontSize: 21,
      paddingLeft: 10,
      marginBottom: 0
   },
   questionExtraText: {
      fontFamily: currentTheme.font.extraLight,
      fontSize: 17,
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 0,
      marginTop: 0
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
   responsesContainer: {
      marginTop: 15,
      paddingLeft: 15,
      paddingRight: 15
   },
   responseText: {
      fontSize: 17
   },
   responseExtraText: {
      fontSize: 15,
      fontFamily: currentTheme.font.light
   },
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

type Question = ThemesAsQuestion | UserPropAsQuestion<UserPropsAsQuestionsTypes>;
type Answer = QuestionAnswerData | UserPropAsQuestionAnswer<UserPropsAsQuestionsTypes>;

export default QuestionForm;
