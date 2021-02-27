import React, { FC, ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
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
import { useIsFocused } from "@react-navigation/native";
import { useServerInfo } from "../../../api/server/server-info";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { useServerProfileStatus } from "../../../api/server/user";
import { userFinishedRegistration } from "../../../api/tools/userTools";
import { LogoAnimator } from "./LogoAnimator/LogoAnimator";
import { removeFromDevice } from "../../../common-tools/device-native-api/storage/storage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useSendPropsToUpdateAtLogin } from "./tools/useSendPropsToUpdateAtLogin";

const LoginPage: FC = () => {
   // These are constants for debugging:
   const showDebugButtons: boolean = false;
   const forceShowConnectButton: boolean = false;

   const [logoAnimCompleted, setLogoAnimCompleted] = useState(false);
   const { colors } = useTheme();
   const { navigateWithoutHistory, navigate } = useNavigation();
   const isFocused = useIsFocused();
   const { data: serverInfoData, isLoading: serverInfoLoading } = useServerInfo();

   // Get the user token
   const { token, isLoading: tokenLoading, getNewTokenFromFacebook } = useFacebookToken();

   // Check the user token is valid
   const { data: tokenIsValid, isLoading: tokenCheckLoading } = useFacebookTokenCheck(token, {
      enabled: token != null
   });

   // If we have a valid user token and finished updating the login props we check if there is any user
   // property missing (caused by unfinished registration or new props)
   const { data: profileStatusData } = useServerProfileStatus({
      config: { enabled: tokenIsValid === true }
   });

   // If we have a valid token we can send the user props that needs to be updated at each login
   const sendLoginPropsCompleted = useSendPropsToUpdateAtLogin(token, serverInfoData, {
      enabled: tokenIsValid === true && serverInfoData != null && profileStatusData != null
   });

   // If the user has props missing redirect to RegistrationForms otherwise redirect to Main
   useEffect(() => {
      if (profileStatusData != null && sendLoginPropsCompleted && logoAnimCompleted && isFocused) {
         navigateWithoutHistory(
            userFinishedRegistration(profileStatusData) ? "Main" : "RegistrationForms"
         );
      }
   }, [profileStatusData, sendLoginPropsCompleted, logoAnimCompleted]);

   /**
    * The login button is visible when we don't have the token or we don't have a valid token.
    * The button calls the Facebook API to get a new Token, showing an authorization screen if
    * the user never authorized the app.
    */
   const handleLoginButtonClick = () => {
      getNewTokenFromFacebook();
   };

   const serverOperating: boolean = serverInfoData?.serverOperating ?? null;

   const showLoginButton: boolean =
      forceShowConnectButton ||
      (serverOperating &&
         (token == null || tokenIsValid === false) &&
         !tokenCheckLoading &&
         !tokenLoading &&
         !serverInfoLoading);

   const showLoadingAnimation: boolean =
      logoAnimCompleted &&
      !showLoginButton &&
      (tokenLoading || tokenCheckLoading || serverInfoLoading || !profileStatusData);

   return (
      <Background useImageBackground={true}>
         <View style={styles.mainContainer}>
            <LoadingAnimation visible={showLoadingAnimation} />
            <View style={styles.logo}>
               <LogoAnimator onAnimationComplete={() => setLogoAnimCompleted(true)}>
                  <LogoSvg color={colors.logoColor} style={{ width: "100%", height: "100%" }} />
               </LogoAnimator>
            </View>
            {serverOperating === false && (
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
                        Lo sentimos, la app no esta disponible en este momento, intenta más tarde
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
                     {serverInfoData?.serverMessage}
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
                     onPress={() => removeFromDevice("pdfbtoken")}
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
                  Iniciar sesión con Facebook
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
