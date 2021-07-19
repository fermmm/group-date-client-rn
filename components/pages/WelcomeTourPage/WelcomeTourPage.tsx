import React, { FC, useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import color from "color";
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

   const topColor = color(colors.background).lightness(82).toString();

   return (
      <BackgroundArtistic>
         <ScreensStepper
            currentScreen={currentStep}
            onScreenChange={newStep => setCurrentStep(newStep)}
            swipeEnabled
         >
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Text style={[styles.bigText, { color: topColor }]}>¡Bienvenidx!</Text>
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Poly es la primera app de citas grupales: Cuando se gustan varias personas se
                     habilita un chat grupal.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <GraphSvg2
                     lineColor={topColor}
                     circleColor={topColor}
                     filled={false}
                     style={styles.logoSvg}
                  />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Hasta ahora cuando pensábamos en una cita nos imaginábamos a solo 2 personas
                     conociéndose, el poliamor habilita citas en grupos de diversos tamaños.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Text style={[styles.bigText, { color: topColor }]}>¡Atención!</Text>
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     La temática de esta app NO sirve para trios ni swinger: No se puede limitar a 3
                     el tamaño de una cita, aquí buscar eso es spam
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Icon name={"calendar-star"} color={topColor} size={iconSize} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Recibirás notificaciones acerca de fiestas y otros eventos de organizaciones de
                     poliamor cercanas
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <LogoSvg color={topColor} style={styles.logoSvg} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Poly es nueva para todxs, no se espera que sepas o hagas nada en particular,
                     solo ganas de conocer gente en una comunidad donde todo puede ser diferente.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.logoContainer}>
                  <Icon name={"account-multiple-plus"} color={topColor} size={iconSize} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Si te gusta la app no olvides mencionarla en las redes o a quienes creas
                     oportuno, todo depende de ese tipo de aportes.
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
      padding: 30
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
      fontSize: 40
   },
   button: {
      position: "absolute",
      bottom: 40,
      maxWidth: "80%",
      borderColor: currentTheme.colors.textLogin
   }
});

export default WelcomeTourPage;
