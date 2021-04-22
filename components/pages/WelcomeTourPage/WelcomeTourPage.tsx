import React, { FC, useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import BackgroundArtistic from "../../common/BackgroundArtistic/BackgroundArtistic";
import { LogoSvg } from "../../../assets/LogoSvg";
import { currentTheme } from "../../../config";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";
import GraphSvg2 from "../../../assets/GraphSvg2";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useWelcomeShowed } from "./tools/useWelcomeShowed";

const WelcomeTourPage: FC = () => {
   const { setAsShowed } = useWelcomeShowed();
   const { navigateWithoutHistory } = useNavigation();
   const [currentStep, setCurrentStep] = useState<number>(0);
   const { colors } = useTheme();
   const iconSize = Dimensions.get("window").width * 0.35;
   const totalSteps = 5;

   const handleContinuePress = useCallback(() => {
      if (currentStep + 1 < totalSteps) {
         setCurrentStep(currentStep + 1);
      } else {
         navigateWithoutHistory("Login");
      }
   }, [currentStep]);

   useEffect(() => {
      setAsShowed();
   }, []);

   return (
      <BackgroundArtistic>
         <ScreensStepper
            currentScreen={currentStep}
            onScreenChange={newStep => setCurrentStep(newStep)}
            swipeEnabled
         >
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Text style={styles.bigText}>¡Bienvenidx!</Text>
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Poly es una app de citas grupales: Cuando se gustan varias personas se habilita
                     un chat grupal. Es la primera app con este funcionamiento de poliamor.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <GraphSvg2
                     lineColor={colors.logoColor}
                     circleColor={colors.logoColor}
                     filled={false}
                     style={styles.logoSvg}
                  />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Hasta ahora cuando pensamos en una cita nos imaginábamos a solo 2 personas
                     conociéndose, el poliamor habilita citas de diversos tamaños.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Icon name={"calendar-star"} color={colors.logoColor} size={iconSize} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     También recibirás notificaciones acerca de fiestas y otros eventos de
                     organizaciones de poliamor cercanas
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <LogoSvg color={colors.logoColor} style={styles.logoSvg} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Poly es nueva para todxs, no se espera que sepas o hagas nada en particular,
                     solo tener ganas de conocer gente en una comunidad donde todo puede ser
                     diferente.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Icon name={"account-multiple-plus"} color={colors.logoColor} size={iconSize} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Si te gusta la app no olvides mencionarla en las redes sociales o donde lo
                     creas oportuno, que esto funcione depende de eso ya que la app es gratuita, sin
                     animo de lucro y de código abierto.
                  </Text>
               </View>
            </View>
         </ScreensStepper>
         <ButtonStyled color={colors.textLogin} onPress={handleContinuePress} style={styles.button}>
            Entendido
         </ButtonStyled>
      </BackgroundArtistic>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      padding: 36
   },
   logoContainer: {
      width: "100%",
      height: "50%",
      alignItems: "center",
      justifyContent: "center"
   },
   logoSvg: {
      width: "100%",
      height: 100
   },
   textContainer: {
      height: "50%"
   },
   text: {
      textAlign: "center",
      fontFamily: currentTheme.font.light,
      fontSize: 18,
      lineHeight: 25,
      color: currentTheme.colors.textLogin
   },
   bigText: {
      textAlign: "center",
      fontFamily: currentTheme.font.medium,
      fontSize: 40,
      color: currentTheme.colors.logoColor
   },
   button: {
      position: "absolute",
      bottom: 40,
      maxWidth: "80%",
      borderColor: currentTheme.colors.textLogin
   }
});

export default WelcomeTourPage;
