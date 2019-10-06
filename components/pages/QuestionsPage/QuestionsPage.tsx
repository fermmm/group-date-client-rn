import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { fakeFilterQuestions } from "../../../server-api/tools/debug-tools/fakeFilterQuestions";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import QuestionForm from "../../common/QuestionForm/QuestionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import { QuestionData } from "../../../server-api/tools/debug-tools/interfaces/questions";
import { fakeProfileQuestionsPart1, fakeProfileQuestionsPart2 } from "../../../server-api/tools/debug-tools/fakeProfileQuestions";
import DialogError from "../../common/DialogError/DialogError";

export interface QuestionsPageProps extends Themed { }
export interface QuestionsPageState {
   currentStep: number;
   showCompleteAnswerError: boolean;
}

class QuestionsPage extends Component<QuestionsPageProps, QuestionsPageState> {
   static defaultProps: Partial<QuestionsPageProps> = {};
   answeredQuestions: boolean[] = [];
   state: QuestionsPageState = {
      currentStep: 0,
      showCompleteAnswerError: false,
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { currentStep }: Partial<QuestionsPageState> = this.state;

      const questions: QuestionData[] = [
         ...fakeProfileQuestionsPart1,
         ...fakeFilterQuestions,
         ...fakeProfileQuestionsPart2
      ];

      return (
         <>
            <AppBarHeader title={"Tus preferencias"} />
            <ScreensStepper
               currentScreen={currentStep}
               swipeEnabled={false}
               onScreenChange={(newStep) => this.setState({ currentStep: newStep })}
            >
               {
                  questions.map((question, i) =>
                     <BasicScreenContainer
                        showBottomGradient={true}
                        bottomGradientColor={colors.backgroundForText}
                        onContinuePress={() =>
                           this.answeredQuestions[i] ?
                              this.setState({ currentStep: currentStep + 1 })
                              :
                              this.setState({ showCompleteAnswerError: true })
                        }
                        onBackPress={() => this.setState({ currentStep: currentStep - 1 })}
                        showBackButton={i !== 0}
                        showContinueButton={true}
                        key={i}
                     >
                        <TitleSmallText style={styles.questionNumberIndicator}>
                           Pregunta {i + 1} de {questions.length}
                        </TitleSmallText>
                        <QuestionForm
                           questionData={question}
                           onChange={selectedAnswers =>
                              this.answeredQuestions[i] = selectedAnswers.length > 0
                           }
                        />
                     </BasicScreenContainer>
                  )
               }
            </ScreensStepper>
            <DialogError 
               visible={this.state.showCompleteAnswerError}
               onDismiss={() => this.setState({showCompleteAnswerError: false})}
            >
               Tenés que contestar la pregunta para poder continuar
            </DialogError>
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   questionNumberIndicator: {
      marginTop: 10,
      opacity: 0.6
   }
});

export default withTheme(QuestionsPage);