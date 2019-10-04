import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import { fakeTestingQuestions, QuestionData } from "../../../server-api/tools/debug-tools/fakeTestingQuestions";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import QuestionForm from "../../common/QuestionForm/QuestionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
 
export interface QuestionsPageProps extends Themed { }
export interface QuestionsPageState { 
   currentStep: number;
}

class QuestionsPage extends Component<QuestionsPageProps, QuestionsPageState> {
   static defaultProps: Partial<QuestionsPageProps> = {};

   state: QuestionsPageState = {
      currentStep: 0
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { currentStep }: Partial<QuestionsPageState> = this.state;
      const questions: QuestionData[] = fakeTestingQuestions;
      
      return (
         <>
            <AppBarHeader title={"Tus preferencias"}/>
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
                        onContinuePress={() => this.setState({ currentStep: currentStep + 1 })}
                        onBackPress={() => this.setState({ currentStep: currentStep - 1  })}
                        showBackButton={i !== 0}
                        showContinueButton={true}
                        key={i}
                     >
                        <TitleSmallText style={styles.questionNumberIndicator}>
                           Pregunta {i + 1} de {questions.length}
                        </TitleSmallText>
                        <QuestionForm questionData={question} />
                     </BasicScreenContainer>
                  )
               }
               
            </ScreensStepper>
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