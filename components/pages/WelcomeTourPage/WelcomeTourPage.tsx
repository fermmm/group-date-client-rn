import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import BackgroundArtistic from "../../common/BackgroundArtistic/BackgroundArtistic";
import { LogoSvg } from "../../../assets/LogoSvg";

const WelcomeTourPage: FC = () => {
   const [currentStep, setCurrentStep] = useState<number>(0);
   const { colors } = useTheme();

   return (
      <BackgroundArtistic>
         <ScreensStepper
            currentScreen={currentStep}
            onScreenChange={newStep => setCurrentStep(newStep)}
            swipeEnabled
         >
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <LogoSvg color={colors.logoColor} style={styles.logoSvg} />
               </View>
               <Text>
                  Poly es una app de citas grupales: Cuando se gustan varias personas formando un
                  grupo se habilita un chat grupal. Es la primera app con este funcionamiento de
                  poliamor grupal.
               </Text>
            </View>
         </ScreensStepper>
      </BackgroundArtistic>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: 36
   },
   logoContainer: {
      position: "absolute",
      top: "30%",
      width: "55%"
   },
   logoSvg: {
      width: "100%",
      height: "100%"
   }
});

export default WelcomeTourPage;
