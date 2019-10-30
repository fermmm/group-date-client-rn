import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text, Checkbox, List, IconButton } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { QuestionData } from "../../../server-api/tools/debug-tools/interfaces/questions";
import TitleText from "../TitleText/TitleText";
import RaddioButtonImproved from "../RadioButtonImproved/RadioButtonImproved";
import { currentTheme } from "../../../config";
import CheckboxButton from "../../common/CheckboxButton/CheckboxButton";
import ListItemImproved from "../ListItemImproved/ListItemImproved";

export interface QuestionProps extends Themed {
   questionData: QuestionData;
   onChange?(selectedAnswers: string[], itsImportantSelected: boolean): void;
}
export interface QuestionState { 
   selectedAnswers: string[];
   itsImportantChecked: boolean;
}

class QuestionForm extends Component<QuestionProps, QuestionState> {
   static defaultProps: Partial<QuestionProps> = {};

   state: QuestionState = {
      selectedAnswers: this.props.questionData.defaultSelectedAnswers || [],
      itsImportantChecked: this.props.questionData.itsImportantSelectedByDefault || false,
   };
   
   render(): JSX.Element {
      const { text, extraText, answers, incompatibilitiesBetweenAnswers, multipleAnswersAllowed }: Partial<QuestionData> = this.props.questionData;
      const { selectedAnswers, itsImportantChecked }: Partial<QuestionState> = this.state;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const incompatibilitiesPresent: boolean = incompatibilitiesBetweenAnswers != null && incompatibilitiesBetweenAnswers !== {};
      const incompatibleResponsesAmmount: number = this.getIncompatibleResponsesIds().length;

      return (
         <>
            <TitleText style={styles.question}>
               {text}
            </TitleText>
            {
               extraText != null &&
                  <TitleText style={styles.questionExtraText}>
                     {extraText}
                  </TitleText>
            }
            {
               multipleAnswersAllowed &&
               <View style={styles.helpTextContainer}>
                  <IconButton
                     icon="live-help"
                     size={25}
                     color={colors.statusOk}
                     style={{opacity: 0.4}}
                  />
                  <TitleText style={styles.helpText}>
                     Se puede seleccionar más de una opción
                  </TitleText>
               </View>
            }
            <View style={styles.responsesContainer}>
               {
                  multipleAnswersAllowed === false ? 
                     answers.map((answer, i) =>
                        <RaddioButtonImproved 
                           checked={selectedAnswers[0] === answer.id}
                           onPress={() => this.setState({selectedAnswers: [answer.id]}, () => this.sendChanges())}
                           key={i}
                        >
                           <Text style={styles.responseText}>
                              {answer.text} 
                              <Text style={styles.responseExtraText}>
                                 {"  "}{answer.extraText}
                              </Text>
                           </Text>
                        </RaddioButtonImproved>
                     )
                  :
                     answers.map((answer, i) =>
                        <CheckboxButton 
                           checked={selectedAnswers.indexOf(answer.id) !== -1}
                           onPress={() => {
                                 selectedAnswers.indexOf(answer.id) === -1 ?
                                    this.setState({
                                       selectedAnswers: [...selectedAnswers, answer.id]
                                    }, () => this.sendChanges())
                                 :
                                    this.removeAnswerFromSelectedList(answer.id);
                              }
                           }
                           key={i}
                        >
                           <Text style={styles.responseText}>
                              {answer.text} 
                              <Text style={styles.responseExtraText}>
                                 {"  "}{answer.extraText}
                              </Text>
                           </Text>
                        </CheckboxButton>
                     )
               }
            </View>
            {
               (selectedAnswers.length > 0 && incompatibilitiesPresent && incompatibleResponsesAmmount > 0) ?
                  <ListItemImproved
                     title="Usar de filtro"
                     description={() => this.getIsImportantDescriptionText()}
                     left={props => 
                        <Checkbox 
                           status={
                              (itsImportantChecked && incompatibleResponsesAmmount > 0) ? 
                                 "checked" : "unchecked"
                           } 
                        />
                     }
                     onPress={() => this.setState({itsImportantChecked: !itsImportantChecked}, () => this.sendChanges())}
                     disabled={incompatibleResponsesAmmount === 0}
                     style={styles.importantCheck}
                  />
               :
                  selectedAnswers.length > 0 && incompatibilitiesPresent && incompatibleResponsesAmmount === 0 &&             
                     <Text style={styles.noFiltersText}>
                        No hay filtros con tu respuesta
                     </Text>
            }
         </>
      );
   }

   getIsImportantDescriptionText(): JSX.Element {
      const incompatibleIds: string[] = this.getIncompatibleResponsesIds();
      const incompatibleResponsesText: string[] = this.getQuestionNamesFromIds(incompatibleIds);

      return (
         <Text style={styles.importantDescriptionTextBold}>
            No mostrarme a quienes responden lo opuesto: 
            {
               incompatibleResponsesText.map((response, i) => 
                  <Text style={styles.importantDescriptionText} key={i}>
                     {i !== 0 && " ni"}{" "}"{response}"
                  </Text>
               )
            }
            
         </Text>
      );
   }

   getIncompatibleResponsesIds(): string[] {
      const { incompatibilitiesBetweenAnswers }: Partial<QuestionData> = this.props.questionData;
      const { selectedAnswers }: Partial<QuestionState> = this.state;
      let result: string[] = [];

      if (incompatibilitiesBetweenAnswers == null) {
         return result;
      }

      for (const selectdAnswerId of selectedAnswers) {
         if (incompatibilitiesBetweenAnswers[selectdAnswerId] != null) {
            result = result.concat(incompatibilitiesBetweenAnswers[selectdAnswerId]);
         }
      }

      return result;
   }

   getQuestionNamesFromIds(ids: string[]): string[] {
      const result: string[] = [];

      for (const answer of this.props.questionData.answers) {
         if (ids.indexOf(answer.id) !== -1) {
            result.push(answer.text);
         }
      }

      return result;
   }

   removeAnswerFromSelectedList(answerId: string): void {
      const selectedAnswers: string[] = [...this.state.selectedAnswers];
      selectedAnswers.splice(selectedAnswers.indexOf(answerId), 1);
      this.setState({selectedAnswers}, () => this.sendChanges());
   }

   sendChanges(): void {
      if (this.props.onChange != null) {
         this.props.onChange(this.state.selectedAnswers, this.state.itsImportantChecked);
      }
   }
}

const styles: Styles = StyleSheet.create({
   question: {
      fontSize: 21,
      paddingLeft: 10,
      marginBottom: 0,
   },
   questionExtraText: {
      fontFamily: currentTheme.fonts.extraLight,
      fontSize: 17,
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 0,
      marginTop: 0,
   },
   helpTextContainer: {
      flexDirection: "row",
      marginTop: 8,
      paddingLeft: 5,
      paddingRight: 5,
      alignItems: "center",
   },
   helpText: {
      flex: 1,
      flexWrap: "wrap",
      fontFamily: currentTheme.fonts.extraLight,
      fontSize: 16,
      marginBottom: 0,
      marginTop: 0,
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
      fontFamily: currentTheme.fonts.light
   },
   importantCheck: {
      marginTop: 50,
      padding: 25
   },
   noFiltersText: {
      marginTop: 50,
      padding: 25,
      fontFamily: currentTheme.fonts.light,
      fontSize: 13,
   },
   importantDescriptionText: {
      fontFamily: currentTheme.fonts.light,
      fontSize: 13,
   },
   importantDescriptionTextBold: {
      fontSize: 14
   }
});

export default withTheme(QuestionForm);
