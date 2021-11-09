import React, { FC, useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { UsableModalComponentProp } from "react-native-modalfy";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import CenterContainer from "../CenterContainer/CenterContainer";
import ModalCloseManager from "../ModalCloseManager/ModalCloseManager";
import { ScreensStepper } from "../ScreensStepper/ScreensStepper";
import EmailStep from "./EmailStep/EmailStep";
import MainStep from "./MainStep/MainStep";
import PasswordStep from "./PasswordStep/PasswordStep";

interface Props {
   modal: UsableModalComponentProp<any, any>;
}

export interface EmailLoginModalProps {
   onLogin: () => void;
   onDismiss: () => void;
}

const modalWidthPercentage = 95;

/**
 * When creating a new modal it needs to be added in App.tsx
 */
const EmailLoginModal: FC<Props> = ({ modal: { closeModal, getParam } }) => {
   const onDismiss = getParam<keyof EmailLoginModalProps, () => void>("onDismiss") as () => void;
   const onLogin = getParam<keyof EmailLoginModalProps, () => void>("onLogin") as () => void;
   const [currentStep, setCurrentStep] = useState(0);
   const [width, setWidth] = useState(null);
   const [goBackTrigger, setGoBackTrigger] = useState<boolean>(null);
   const [signUpEmail, setSignUpEmail] = useState<string>(null);
   const [signUpPassword1, setSignUpPassword1] = useState<string>(null);
   const [signUpPassword2, setSignUpPassword2] = useState<string>(null);
   const [loginEmail, setLoginEmail] = useState<string>(null);
   const [loginPassword, setLoginPassword] = useState<string>(null);
   const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>(null);

   const handleSignUpComplete = () => {
      // TODO: Llamar al endpoint, si la respuesta trae el token seguir si no mostrar el error
      // TODO: Mostrar un Dialog que avisa que mando un mail con boton a ir a la aplicacion de email
      // TODO: Poner una pantalla aca de "Ya valide mi email" que llama cada tanto a la api y cuando se hace focus en la app
      // TODO: Cuando se apreta en "ya valide mi email" se guardan las credenciales en el local storage y se llama a handleLoginComplete(token)
      handleLoginComplete();
      console.log("SIGNUP COMPLETE");
   };

   const handleLoginComplete = () => {
      // TODO: LLamar al endpoint y si devuelve el token mandarlo en onLogin
      // TODO: onLogin tiene que devolver el token
      onLogin?.();
      closeModal();
   };

   const handleForgotPasswordComplete = () => {
      // TODO: Llamar al endpoint y si devuelve ok solo mostrar mensaje de que reviste el email
      handleModalDismiss();
   };

   const handleModalDismiss = () => {
      onDismiss?.();
      closeModal();
   };

   const goToNextStep = () => {
      setCurrentStep(currentStep + 1);
   };

   const goToPreviousStep = () => {
      setCurrentStep(currentStep - 1);
   };

   const goToMainStep = () => {
      setCurrentStep(0);
   };

   const goToLoginStep = () => {
      setCurrentStep(1);
   };

   const goToSignUpStep = () => {
      setCurrentStep(3);
   };

   const gotoForgotPasswordStep = () => {
      setCurrentStep(6);
   };

   // Called by back button/gesture
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   return (
      <ModalCloseManager onClose={handleModalDismiss}>
         <CenterContainer>
            <View style={styles.mainContainer}>
               <ScrollView
                  contentContainerStyle={styles.contentContainer}
                  onLayout={e => setWidth(e.nativeEvent.layout.width)}
               >
                  <ScreensStepper
                     currentScreen={currentStep}
                     swipeEnabled={false}
                     onScreenChange={handleScreenChange}
                     onBackPressAndNoHistory={handleModalDismiss}
                     screensWidth={
                        width != null
                           ? width
                           : (Dimensions.get("window").width * modalWidthPercentage) / 100
                     }
                     goBackTrigger={goBackTrigger}
                  >
                     {/** MAIN */}

                     <MainStep
                        onLogin={goToLoginStep}
                        onSignUp={goToSignUpStep}
                        onForgotPassword={gotoForgotPasswordStep}
                     />

                     {/** LOGIN */}

                     <EmailStep
                        onSubmit={email => {
                           setSignUpEmail(email);
                           goToNextStep();
                        }}
                        onBackPress={goToMainStep}
                     />
                     <PasswordStep
                        onSubmit={pass => {
                           setLoginPassword(pass);
                           handleLoginComplete();
                        }}
                        onBackPress={goToPreviousStep}
                        onForgotPasswordPress={gotoForgotPasswordStep}
                     />

                     {/** SIGN-UP */}

                     <EmailStep
                        onSubmit={email => {
                           setSignUpEmail(email);
                           goToNextStep();
                        }}
                        onBackPress={goToMainStep}
                     />
                     <PasswordStep
                        onSubmit={pass => {
                           setSignUpPassword1(pass);
                           goToNextStep();
                        }}
                        onBackPress={goToPreviousStep}
                     />
                     <PasswordStep
                        previousPassword={signUpPassword1}
                        onSubmit={pass => {
                           setSignUpPassword2(pass);
                           handleSignUpComplete();
                        }}
                        onBackPress={goToPreviousStep}
                     />

                     {/** FORGOT-PASSWORD */}
                     <EmailStep
                        onSubmit={email => {
                           setForgotPasswordEmail(email);
                           handleForgotPasswordComplete();
                        }}
                        onBackPress={goToMainStep}
                        isForgotPasswordStep
                     />
                  </ScreensStepper>
               </ScrollView>
            </View>
         </CenterContainer>
      </ModalCloseManager>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: `${modalWidthPercentage}%`,
      backgroundColor: currentTheme.colors.backgroundBottomGradient,
      borderRadius: currentTheme.roundnessSmall,
      minWidth: 200
   },
   contentContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 25,
      paddingBottom: 25
   },
   button: {
      borderColor: currentTheme.colors.accent2,
      minWidth: 180
   }
});

export default EmailLoginModal;
