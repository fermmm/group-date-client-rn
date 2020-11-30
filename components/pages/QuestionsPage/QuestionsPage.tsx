import React, { FC, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import QuestionForm from "../../common/QuestionForm/QuestionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface QuestionsPageProps {
   appBarTitle?: string;
   backButtonChangesPage?: boolean;
   startingQuestion?: number;
   showBottomButtons?: boolean;
   onFinishGoBack?: boolean;
}

const QuestionsPage: FC<QuestionsPageProps> = ({
   appBarTitle = "Nueva cuenta",
   backButtonChangesPage = false,
   startingQuestion = 0,
   showBottomButtons = true,
   onFinishGoBack = false
}) => {
   const answeredQuestions: boolean[] = [];

   // TODO: Retrieve questions from server, also the propsAsQuestions should come from server
   const questions = [];

   const [currentStep, setCurrentStep] = useState(startingQuestion);
   const [showCompleteAnswerError, setShowCompleteAnswerError] = useState(false);
   const { colors }: ThemeExt = useTheme();
   const { navigate, goBack }: StackNavigationProp<Record<string, {}>> = useNavigation();

   useEffect(() => {
      if (questions.length === 0) {
         onFinishAnsweringQuestions();
      }
   }, []);

   const onFinishAnsweringQuestions = () => {
      if (onFinishGoBack) {
         goBack();
      } else {
         // TODO: The redirect route should come from props
         navigate("Main");
      }
   };

   return (
      <>
         <AppBarHeader
            title={appBarTitle}
            onBackPress={
               currentStep > 0 && !backButtonChangesPage
                  ? () => setCurrentStep(currentStep - 1)
                  : null
            }
         />
         <ScreensStepper
            currentScreen={currentStep}
            swipeEnabled={false}
            onScreenChange={setCurrentStep}
         >
            {questions.map((question, i) => (
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onBackPress={() => setCurrentStep(currentStep - 1)}
                  onContinuePress={() =>
                     answeredQuestions[i]
                        ? currentStep < questions.length - 1
                           ? setCurrentStep(currentStep + 1)
                           : onFinishAnsweringQuestions()
                        : setShowCompleteAnswerError(true)
                  }
                  showBackButton={i !== 0 && showBottomButtons}
                  showContinueButton={showBottomButtons}
                  key={i}
               >
                  <TitleSmallText style={styles.questionNumberIndicator}>
                     Pregunta {i + 1} de {questions.length}
                  </TitleSmallText>
                  <QuestionForm
                     questionData={question}
                     onChange={selectedAnswers =>
                        (answeredQuestions[i] = selectedAnswers.length > 0)
                     }
                  />
               </BasicScreenContainer>
            ))}
         </ScreensStepper>
         <DialogError
            visible={showCompleteAnswerError}
            onDismiss={() => setShowCompleteAnswerError(false)}
         >
            Tienes que contestar la pregunta para poder continuar
         </DialogError>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   questionNumberIndicator: {
      marginTop: 10,
      opacity: 0.6
   }
});

export default QuestionsPage;
