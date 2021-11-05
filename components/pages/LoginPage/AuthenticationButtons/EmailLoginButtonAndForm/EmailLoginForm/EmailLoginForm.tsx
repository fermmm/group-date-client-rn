import React, { FC, useCallback, useState } from "react";
import { ModalTransparent } from "../../../../../common/ModalTransparent/ModalTransparent";
import { View, StyleSheet, ScrollView } from "react-native";
import { Styles } from "../../../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../../../config";
import { Button } from "react-native-paper";
import { ScreensStepper } from "../../../../../common/ScreensStepper/ScreensStepper";

export interface PropsEmailLoginForm {
   onClose: () => void;
}

const EmailLoginForm: FC<PropsEmailLoginForm> = props => {
   const { onClose } = props;
   const [currentStep, setCurrentStep] = useState(0);
   const [width, setWidth] = useState(null);
   const [goBackTrigger, setGoBackTrigger] = useState<boolean>(null);

   const handleLoginPress = () => {
      setCurrentStep(1);
   };

   const handleSignUpPress = () => {
      setCurrentStep(2);
   };

   const handleBackPress = () => {
      if (currentStep > 0) {
         setGoBackTrigger(!Boolean(goBackTrigger));
      } else {
         onClose();
      }
   };

   // Called by back button/gesture
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   return (
      <ModalTransparent
         onClose={onClose}
         closeWithBackButton={false}
         onBackButtonPress={handleBackPress}
      >
         <View style={styles.mainContainer}>
            <ScrollView
               contentContainerStyle={styles.contentContainer}
               onLayout={e => setWidth(e.nativeEvent.layout.width)}
            >
               {width && (
                  <ScreensStepper
                     currentScreen={currentStep}
                     swipeEnabled={false}
                     onScreenChange={handleScreenChange}
                     screensWidth={width}
                     goBackTrigger={goBackTrigger}
                  >
                     <View style={styles.stepContainer}>
                        <Button
                           onPress={handleLoginPress}
                           mode="outlined"
                           color={currentTheme.colors.accent2}
                           style={[styles.button, { marginBottom: 20 }]}
                        >
                           Ya tengo cuenta
                        </Button>
                        <Button
                           onPress={handleSignUpPress}
                           mode="outlined"
                           color={currentTheme.colors.accent2}
                           style={styles.button}
                        >
                           Registrarme
                        </Button>
                     </View>
                     <View style={styles.stepContainer}>
                        <Button
                           onPress={handleSignUpPress}
                           mode="outlined"
                           color={currentTheme.colors.accent2}
                           style={styles.button}
                        >
                           Login
                        </Button>
                     </View>
                     <View style={styles.stepContainer}>
                        <Button
                           onPress={handleSignUpPress}
                           mode="outlined"
                           color={currentTheme.colors.accent2}
                           style={styles.button}
                        >
                           Signup
                        </Button>
                     </View>
                  </ScreensStepper>
               )}
            </ScrollView>
         </View>
      </ModalTransparent>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "90%",
      backgroundColor: currentTheme.colors.backgroundBottomGradient,
      borderRadius: currentTheme.roundnessSmall,
      marginTop: 50,
      marginBottom: 50
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
   },
   stepContainer: {
      paddingLeft: 20,
      paddingRight: 20
   }
});

export default EmailLoginForm;
