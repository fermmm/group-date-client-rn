import React, { FC, useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Alert } from "react-native";
import { emailLoginGet, emailLoginResetPasswordPost } from "../../../api/server/email-login";
import { LoginResponse } from "../../../api/server/shared-tools/endpoints-interfaces/email-login";
import { tryToGetErrorMessage } from "../../../api/tools/httpRequest";
import { openEmailApp } from "../../../common-tools/device-native-api/device-action/openEmailApp";
import { getLinkToApp } from "../../../common-tools/navigation/getLinkToApp";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import CenterContainer from "../CenterContainer/CenterContainer";
import { useDialogModal } from "../DialogModal/tools/useDialogModal";
import { ModalRequiredProps } from "../GlobalModalsProvider/GlobalModalsProvider";
import ModalBackground from "../ModalBackground/ModalBackground";
import { ScreensStepper } from "../ScreensStepper/ScreensStepper";
import EmailStep from "./EmailStep/EmailStep";
import EmailValidationStep from "./EmailValidationStep/EmailValidationStep";
import MainStep from "./MainStep/MainStep";
import PasswordStep from "./PasswordStep/PasswordStep";

export interface PropsEmailLoginModal extends ModalRequiredProps {
   onLogin: (token: string) => void;
   onDismiss: () => void;
}

const modalWidthPercentage = 100;

/**
 * Having all the forms in one component it's not the best design but it's the easiest way to support
 * the back button.
 */
const EmailLoginModal: FC<PropsEmailLoginModal> = ({ onLogin, onDismiss, close }) => {
   const [isLoading, setIsLoading] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [width, setWidth] = useState(null);
   const [goBackTrigger, setGoBackTrigger] = useState<boolean>(null);
   const [signUpEmail, setSignUpEmail] = useState<string>(null);
   const [signUpPassword1, setSignUpPassword1] = useState<string>(null);
   const [loginEmail, setLoginEmail] = useState<string>(null);
   const [enableAnimation, setEnableAnimation] = useState<boolean>(false);
   const { openDialogModal } = useDialogModal();

   const handleSignUp = async (token: string) => {
      onLogin?.(token);
      openDialogModal({
         message: "Has creado tu cuenta con éxito =)",
         buttons: [{ label: "Ok" }]
      });
      close();
   };

   const handleLogin = async (password: string) => {
      let response: LoginResponse;
      setIsLoading(true);
      try {
         response = await emailLoginGet({ email: loginEmail, password });
      } catch (error) {
         Alert.alert("", tryToGetErrorMessage(error));
         setIsLoading(false);
      }

      if (response?.userExists && response?.token) {
         onLogin?.(response.token);
         close();
      } else {
         // Loading is falso only when there is an error because it looks better like this
         setIsLoading(false);
      }
   };

   const handleForgotPasswordComplete = (email: string) => {
      emailLoginResetPasswordPost({ email, appUrl: getLinkToApp() });
      openDialogModal({
         message: "Te hemos enviado un email para que cambies el password",
         buttons: [{ label: "Ok" }, { label: "Abrir app de emails", onPress: openEmailApp }]
      });
      handleModalDismiss();
   };

   const handleModalDismiss = () => {
      close();
      onDismiss?.();
   };

   /**
    * Called when the user is trying to sing up and the email is already in use.
    */
   const handleAccountAlreadyExists = () => {
      openDialogModal({
         message: 'Ya existe una cuenta con ese email. Inicia sesión o toca "Olvide la contraseña"'
      });
      handleModalDismiss();
   };

   const goToNextStep = () => {
      setEnableAnimation(true);
      setCurrentStep(currentStep + 1);
   };

   const goToPreviousStep = () => {
      setEnableAnimation(true);
      setCurrentStep(currentStep - 1);
   };

   const goToMainStep = () => {
      setEnableAnimation(false);
      setCurrentStep(0);
   };

   const goToLoginStep = () => {
      setEnableAnimation(false);
      setCurrentStep(1);
   };

   const goToSignUpStep = () => {
      setEnableAnimation(false);
      setCurrentStep(4);
   };

   const gotoForgotPasswordStep = () => {
      setEnableAnimation(false);
      setCurrentStep(3);
   };

   const isEmailVerificationCheckStep = () => {
      return currentStep === 7;
   };

   // Called by back button/gesture
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   return (
      <ModalBackground onClose={handleModalDismiss} contentPosition={"bottom"}>
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
                     goingBackEnabled={!isEmailVerificationCheckStep()}
                     screensWidth={
                        width != null
                           ? width
                           : (Dimensions.get("window").width * modalWidthPercentage) / 100
                     }
                     goBackTrigger={goBackTrigger}
                     animated={enableAnimation}
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
                           setLoginEmail(email);
                           goToNextStep();
                        }}
                        onBackPress={goToMainStep}
                     />
                     <PasswordStep
                        onSubmit={handleLogin}
                        onBackPress={goToPreviousStep}
                        onForgotPasswordPress={gotoForgotPasswordStep}
                        showLoadingAnimation={isLoading}
                     />

                     {/** FORGOT-PASSWORD */}

                     <EmailStep
                        title={"Olvide la contraseña"}
                        onSubmit={email => {
                           handleForgotPasswordComplete(email);
                        }}
                        onBackPress={goToMainStep}
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
                           goToNextStep();
                        }}
                        onBackPress={goToPreviousStep}
                     />
                     <EmailValidationStep
                        title={"Valida tu email"}
                        subtitle={"Para continuar revisa el mail que te hemos enviado"}
                        credentials={{ email: signUpEmail, password: signUpPassword1 }}
                        stepIsFocused={isEmailVerificationCheckStep()}
                        onValidationConfirmed={handleSignUp}
                        onAccountAlreadyExists={handleAccountAlreadyExists}
                     />
                  </ScreensStepper>
               </ScrollView>
            </View>
         </CenterContainer>
      </ModalBackground>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: `${modalWidthPercentage}%`,
      backgroundColor: currentTheme.colors.backgroundBottomGradient,
      borderRadius: currentTheme.roundness,
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
