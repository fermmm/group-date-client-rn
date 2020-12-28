import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Checkbox, IconButton } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import TitleText from "../TitleText/TitleText";
import RadioButtonImproved from "../RadioButtonImproved/RadioButtonImproved";
import { currentTheme } from "../../../config";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import ListItemImproved from "../ListItemImproved/ListItemImproved";
import {
   QuestionAnswerData,
   ThemeBasicInfo,
   ThemesAsQuestion
} from "../../../api/server/shared-tools/endpoints-interfaces/themes";
import { checkTypeByMember } from "../../../common-tools/ts-tools/common-ts-tools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import {
   UserPropAsQuestion,
   UserPropAsQuestionAnswer,
   UserPropsAsQuestionsTypes
} from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserProps } from "../../../api/server/shared-tools/validators/user";
import { usePropsAsQuestions } from "../../../api/server/user";
import { useThemesAsQuestions } from "../../../api/server/themes";

/**
 * This component can be used with questions that change props or themes depending on which is not null:
 * propAsQuestionToShow or themeAsQuestionToShow
 */
export interface PropsThemesAsQuestionForm {
   questionId: number;
   initialDataThemesAsQuestions?: ThemesInfo;
   onChange?: (updateInfo: ThemesToUpdate) => void;
}

const ThemesAsQuestionForm: FC<PropsThemesAsQuestionForm> = props => {
   // These 2 requests receive a list of all the questions with their texts to be used as required
   const { data: propsAsQuestions, isLoading: propsAsQuestionLoading } = usePropsAsQuestions({
      enabled: propAsQuestionToShow != null
   });
   const { data: themesAsQuestions, isLoading: themesAsQuestionsLoading } = useThemesAsQuestions({
      enabled: themeAsQuestionToShow != null
   });

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

interface ThemesInfo {
   themesSubscribed?: ThemeBasicInfo[];
   themesBlocked?: ThemeBasicInfo[];
}

interface ThemesToUpdate {
   themesToUnsubscribe?: string[];
   themesToSubscribe?: string[];
   themesToBlock?: string[];
   themesToUnblock?: string[];
   questionsShowed?: number[]; //themeQuestion.questionId
}

enum QuestionType {
   PropAsQuestion,
   ThemeAsQuestion
}

type Answer = QuestionAnswerData | UserPropAsQuestionAnswer;

export default QuestionForm;
