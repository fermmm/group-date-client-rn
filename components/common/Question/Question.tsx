import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import TitleText from "../TitleText/TitleText";
import RadioButtonImproved from "../RadioButtonImproved/RadioButtonImproved";
import { currentTheme } from "../../../config";
import CheckboxButton from "../../common/CheckboxButton/CheckboxButton";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import ItsImportantCheck from "./ItsImportantCheck/ItsImportantCheck";

export interface PropsQuestion {
   questionText: string;
   answers: Answer[];
   initiallySelected?: string[];
   onChange: (changes: QuestionOnChange) => void;
   questionExtraText?: string;
   multipleAnswersAllowed?: boolean;
   incompatibilitiesBetweenAnswers?: { [key: number]: number[] };
   itsImportantChecked?: boolean;
}

export interface Answer {
   text: string;
   extraText?: string;
   id: string;
}

export interface QuestionOnChange {
   selectedAnswer?: string;
   selectedAnswerMultiple?: string[];
   itsImportantChecked?: boolean;
}

const Question: FC<PropsQuestion> = props => {
   const {
      questionText,
      questionExtraText,
      multipleAnswersAllowed,
      answers,
      onChange,
      incompatibilitiesBetweenAnswers,
      initiallySelected
   } = props;
   const { colors } = useTheme();
   const [selectedAnswer, setSelectedAnswer] = useState<string>(initiallySelected?.[0]);
   const [selectedAnswerMultiple, setSelectedAnswerMultiple] = useState<string[]>(
      initiallySelected
   );
   const [itsImportantChecked, setItsImportantChecked] = useState(null);

   useEffect(() => onChange({ selectedAnswer, selectedAnswerMultiple, itsImportantChecked }), [
      selectedAnswer,
      selectedAnswerMultiple,
      itsImportantChecked
   ]);

   const toggleAnswerFromList = (answerId: string) => {
      if (selectedAnswerMultiple.includes(answerId)) {
         return setSelectedAnswerMultiple(selectedAnswerMultiple.filter(a => a !== answerId));
      } else {
         return setSelectedAnswerMultiple([...selectedAnswerMultiple, answerId]);
      }
   };

   return (
      <>
         <TitleText style={styles.question}>{questionText}</TitleText>
         {questionExtraText != null && (
            <TitleText style={styles.questionExtraText}>{questionExtraText}</TitleText>
         )}
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
            {multipleAnswersAllowed
               ? answers.map((answer: Answer, i) => (
                    <CheckboxButton
                       checked={selectedAnswerMultiple.includes(answer.id)}
                       onPress={() => toggleAnswerFromList(answer.id)}
                       key={i}
                    >
                       <Text style={styles.responseText}>{answer.text}</Text>
                       {answer.extraText != null && (
                          <Text style={styles.responseExtraText}>
                             {"  "}
                             {answer.extraText}
                          </Text>
                       )}
                    </CheckboxButton>
                 ))
               : answers.map((answer, i) => (
                    <RadioButtonImproved
                       checked={selectedAnswer === answer.id}
                       onPress={() => setSelectedAnswer(answer.id)}
                       key={i}
                    >
                       <Text style={styles.responseText}>{answer.text}</Text>
                       {answer.extraText != null && (
                          <Text style={styles.responseExtraText}>
                             {"  "}
                             {answer.extraText}
                          </Text>
                       )}
                    </RadioButtonImproved>
                 ))}
         </View>
         <ItsImportantCheck
            answers={answers}
            checked={itsImportantChecked}
            onChange={checked => setItsImportantChecked(checked)}
            selectedAnswer={answers.findIndex(a => a.id === selectedAnswer)}
            incompatibilitiesBetweenAnswers={incompatibilitiesBetweenAnswers}
         />
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
   }
});

export default Question;
