import React, { FC, ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import Constants from "expo-constants";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { LogoSvg } from "../../../assets/LogoSvg";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";
import { currentTheme } from "../../../config";
import {
   useFacebookToken,
   useFacebookTokenCheck
} from "../../../api/third-party/facebook/facebook-login";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useNavigation } from "@react-navigation/native";
import { useServerHandshake } from "../../../api/server/handshake";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { useServerProfileStatus } from "../../../api/server/user";
import { userFinishedRegistration } from "../../../api/tools/userTools";
import { LogoAnimator } from "./LogoAnimator/LogoAnimator";
import { removeFromDeviceSecure } from "../../../common-tools/device-native-api/storage/storage";

const LoginPage: FC = () => {
   // These are constants for debugging:
   const showDebugButtons: boolean = false;
   const forceShowConnectButton: boolean = false;

   const [logoAnimCompleted, setLogoAnimCompleted] = useState(false);
   const { colors } = useTheme();
   const { navigate } = useNavigation();

   // Send the version of the client to get information about possible updates needed and service status
   const { data: handshakeData, isLoading: handshakeLoading } = useServerHandshake({
      version: Constants.manifest.version
   });

   // Get the user token
   const { token, isLoading: tokenLoading, getNewTokenFromFacebook } = useFacebookToken();

   // Check the user token is valid
   const { data: tokenIsValid, isLoading: tokenCheckLoading } = useFacebookTokenCheck(token, {
      enabled: token != null
   });

   // If we have the user token we check if there is any user property missing (unfinished registration or not registered)
   const { data: profileStatusData, isLoading: profileStatusLoading } = useServerProfileStatus(
      { token },
      { enabled: tokenIsValid }
   );

   // If the user has unfinished registration redirect to RegistrationForms otherwise redirect to Main
   useEffect(() => {
      const registrationFinished: boolean = userFinishedRegistration(profileStatusData);
      if (profileStatusData != null && logoAnimCompleted) {
         navigate(registrationFinished ? "Main" : "RegistrationForms");
      }
   }, [profileStatusData, logoAnimCompleted]);

   /**
    * The login button is visible when we don't have the token or we don't have a valid token.
    * The button calls the Facebook API to get a new Token, showing an authorization screen if
    * the user never authorized the app.
    */
   const handleLoginButtonClick = () => {
      getNewTokenFromFacebook();
   };

   const serverOperating: boolean = handshakeData != null && handshakeData.serverOperating;

   const showLoginButton: boolean =
      (serverOperating &&
         (token == null || tokenIsValid === false) &&
         !tokenCheckLoading &&
         !tokenLoading &&
         !handshakeLoading) ||
      forceShowConnectButton;

   const showLoadingAnimation: boolean =
      logoAnimCompleted &&
      (tokenLoading || tokenCheckLoading || handshakeLoading || profileStatusLoading);

   return (
      <Background useImageBackground={true}>
         <View style={styles.mainContainer}>
            <LoadingAnimation visible={showLoadingAnimation} />
            <View style={styles.logo}>
               <LogoAnimator onAnimationComplete={() => setLogoAnimCompleted(true)}>
                  <LogoSvg color={colors.logoColor} style={{ width: "100%", height: "100%" }} />
               </LogoAnimator>
            </View>
            {!serverOperating && (
               <>
                  <Text
                     style={[
                        styles.textBlock,
                        {
                           marginBottom: 15
                        }
                     ]}
                  >
                     <Text
                        style={{
                           fontWeight: "bold"
                        }}
                     >
                        Lo sentimos, la app no esta disponible en este momento
                     </Text>
                  </Text>
                  <Text
                     style={[
                        styles.textBlock,
                        {
                           marginBottom: 100
                        }
                     ]}
                  >
                     {handshakeData?.serverMessage}
                  </Text>
               </>
            )}
            {__DEV__ && showDebugButtons && (
               <>
                  <ButtonStyled
                     color={colors.textLogin}
                     style={{
                        borderColor: colors.textLogin
                     }}
                     onPress={() => navigate("Main")}
                  >
                     App UI
                  </ButtonStyled>
                  <ButtonStyled
                     color={colors.textLogin}
                     style={{
                        borderColor: colors.textLogin
                     }} // onPress={() => navigate("Questions")}
                     onPress={() => navigate("RegistrationForms")}
                  >
                     Nueva cuenta UI
                  </ButtonStyled>
                  <ButtonStyled
                     color={colors.textLogin}
                     style={{
                        borderColor: colors.textLogin
                     }}
                     onPress={() => removeFromDeviceSecure("pdfbtoken")}
                  >
                     Debug button
                  </ButtonStyled>
               </>
            )}
            {showLoginButton && (
               <ButtonStyled
                  color={colors.textLogin}
                  style={{ borderColor: colors.textLogin }}
                  onPress={handleLoginButtonClick}
               >
                  Comenzar
               </ButtonStyled>
            )}
         </View>
      </Background>
   );
};

function Background(props: { children?: ReactNode; useImageBackground: boolean }): JSX.Element {
   if (props.useImageBackground) {
      return (
         <ImageBackground source={currentTheme.backgroundImage} style={styles.background}>
            {props.children}
         </ImageBackground>
      );
   } else {
      return (
         <LinearGradient
            colors={[
               currentTheme.colors.specialBackground1,
               currentTheme.colors.specialBackground2
            ]}
            style={styles.background}
            start={[0, 0.5]}
            end={[0, 1.3]}
         >
            {props.children}
         </LinearGradient>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: 36
   },
   background: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end"
   },
   logo: {
      position: "absolute",
      top: "30%",
      width: "55%"
   },
   textBlock: {
      textAlign: "center",
      fontFamily: currentTheme.font.light,
      color: currentTheme.colors.textLogin
   },
   secondTextBlock: {
      marginBottom: 65,
      textAlign: "center"
   }
});

export default LoginPage;
