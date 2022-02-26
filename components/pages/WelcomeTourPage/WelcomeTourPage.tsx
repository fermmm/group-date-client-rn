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
import Svg from "../../../common-tools/svg-tools/Svg";
import screen1PortalSvg from "../../../assets/welcome_images/screen1-portal.svg";
import screen2HeartSvg from "../../../assets/welcome_images/screen2-heart.svg";
import screen4PoolSvg from "../../../assets/welcome_images/screen4-pool.svg";
import screen5PrimitivesSvg from "../../../assets/welcome_images/screen5-primitives.svg";
import screen5PrimitivesOverlayLeftSvg from "../../../assets/welcome_images/screen5-primitives-overlay-left.svg";
import screen5PrimitivesOverlayRightSvg from "../../../assets/welcome_images/screen5-primitives-overlay-right.svg";
import screen5PrimitivesOverlayTopSvg from "../../../assets/welcome_images/screen5-primitives-overlay-top.svg";
import TitleText from "../../common/TitleText/TitleText";

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
               <View style={styles.imageContainer}>
                  <Svg src={screen1PortalSvg} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     GroupDate es la primera app de citas grupales. Cuando se gustan entre muchxs se
                     habilita un chat grupal.
                  </Text>
               </View>
            </View>
            <View style={[styles.mainContainer, { backgroundColor: colors.specialBackground3 }]}>
               <View style={styles.imageContainer}>
                  <Svg src={screen2HeartSvg} />
               </View>
               <View style={styles.textContainer}>
                  <TitleText style={styles.title}>Es para todxs</TitleText>
                  <Text style={styles.text}>
                     Todas las orientaciones y tipos de vínculos pueden ser parte de una cita
                     grupal.
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.imageContainer}>
                  <Text style={[styles.bigText, { color: topColor }]}>¡Hetero Friendly!</Text>
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     Todas las orientaciones y tipos de vínculos pueden ser parte de una cita grupal
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.imageContainer}>
                  <Svg src={screen4PoolSvg} />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     No se espera que sepas o hagas algo en particular, solo disfrutar de amistades
                     y vínculos{" "}
                     <Text style={styles.textBold}>
                        sin perspectivas monógamas que consideramos del patriarcado
                     </Text>
                  </Text>
               </View>
            </View>
            <View style={styles.mainContainer}>
               <View style={styles.imageContainer}>
                  <Svg src={screen5PrimitivesSvg} width={"85%"} />
                  <Svg
                     src={screen5PrimitivesOverlayLeftSvg}
                     style={{ position: "absolute", left: -15 }}
                     width={"40%"}
                  />
                  <Svg
                     src={screen5PrimitivesOverlayRightSvg}
                     style={{ position: "absolute", right: -15, top: 10 }}
                     width={"40%"}
                  />
                  <Svg
                     src={screen5PrimitivesOverlayTopSvg}
                     style={{ position: "absolute", top: 20 }}
                     height={"25%"}
                  />
               </View>
               <View style={styles.textContainer}>
                  <Text style={styles.text}>
                     No tenemos interés monetario y funcionamos gracias a colaboraciones diversas.
                     {"\n"}
                     <Text style={styles.textBold}>
                        Si te gusta la app no olvides mencionarla en las redes o donde creas
                        oportuno
                     </Text>
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
      justifyContent: "center"
   },
   imageContainer: {
      width: "85%",
      height: "60%",
      paddingTop: "20%",
      alignItems: "center",
      justifyContent: "center"
   },
   logoSvg: {
      width: "100%",
      height: 100
   },
   textContainer: {
      width: "100%",
      height: "50%"
   },
   title: {
      textAlign: "center",
      fontFamily: currentTheme.font.semiBold,
      textTransform: "uppercase",
      fontSize: 32,
      color: currentTheme.colors.textLogin,
      letterSpacing: 2.4,
      marginBottom: 40,
      width: "100%"
   },
   text: {
      textAlign: "center",
      fontFamily: currentTheme.font.medium,
      fontSize: 18,
      lineHeight: 25,
      color: currentTheme.colors.textLogin,
      paddingLeft: 60,
      paddingRight: 60
   },
   textBold: {
      textAlign: "center",
      fontFamily: currentTheme.font.semiBold,
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
