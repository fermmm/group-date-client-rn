import React, { FC, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
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
import { usePushNotificationPressRedirect } from "../../../common-tools/device-native-api/notifications/usePushNotificationPressRedirect";
import BackgroundArtistic from "../../common/BackgroundArtistic/BackgroundArtistic";
import { showBetaVersionMessage } from "../../../common-tools/messages/showBetaVersionMessage";

const LoginPage: FC = () => {
   // These are constants for debugging:
   const showDebugButtons: boolean = false;
   const forceShowConnectButton: boolean = false;

   const [logoAnimCompleted, setLogoAnimCompleted] = useState(false);
   const { colors } = useTheme();
   const { navigateWithoutHistory, navigate } = useNavigation();
   const { redirectFromPushNotificationPress } = usePushNotificationPressRedirect();
   const isFocused = useIsFocused();
   const { data: serverInfoData, isLoading: serverInfoLoading, error } = useServerInfo();
   const serverOperating: boolean = serverInfoLoading
      ? null
      : serverInfoData?.serverOperating ?? error == null;
   const canContinue = serverOperating && serverInfoData?.versionIsCompatible;

   // Get the user token
   const { token, isLoading: tokenLoading, getNewTokenFromFacebook } = useFacebookToken();

   // Check the user token is valid
   const {
      data: { valid: tokenIsValid } = { valid: false },
      isLoading: tokenCheckLoading
   } = useFacebookTokenCheck(token, {
      enabled: token != null
   });

   // If we have a valid user token and finished updating the login props we check if there is any user
   // property missing (caused by unfinished registration or new props)
   const { data: profileStatusData, error: profileStatusError } = useServerProfileStatus({
      config: { enabled: tokenIsValid === true && canContinue === true },
      requestParams: { token }
   });

   const finishedRegistration = userFinishedRegistration(profileStatusData);

   // If we have a valid token we can send the user props that needs to be updated at each login
   const sendLoginPropsCompleted = useSendPropsToUpdateAtLogin(token, serverInfoData, {
      enabled:
         tokenIsValid === true &&
         canContinue === true &&
         profileStatusData != null &&
         finishedRegistration === true
   });

   // If the user has props missing redirect to RegistrationForms otherwise redirect to Main or notification press
   useEffect(() => {
      if (profileStatusData != null && logoAnimCompleted && isFocused) {
         if (!finishedRegistration) {
            navigateWithoutHistory("RegistrationForms");
         } else {
            if (!sendLoginPropsCompleted) {
               return;
            }

            if (redirectFromPushNotificationPress != null) {
               const redirected = redirectFromPushNotificationPress();
               if (!redirected) {
                  navigateWithoutHistory("Main");
               }
            } else {
               navigateWithoutHistory("Main");
            }
            showBetaVersionMessage();
         }
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

   const showLoginButton: boolean =
      forceShowConnectButton ||
      profileStatusError ||
      (canContinue &&
         (token == null || tokenIsValid === false) &&
         !tokenCheckLoading &&
         !tokenLoading &&
         !serverInfoLoading);

   const showLoadingAnimation: boolean =
      canContinue &&
      logoAnimCompleted &&
      !showLoginButton &&
      !profileStatusError &&
      (tokenLoading || tokenCheckLoading || serverInfoLoading || !profileStatusData);

   return (
      <BackgroundArtistic useImageBackground={true}>
         <View style={styles.mainContainer}>
            <LoadingAnimation visible={showLoadingAnimation} />
            <View style={styles.logo}>
               <LogoAnimator onAnimationComplete={() => setLogoAnimCompleted(true)}>
                  <LogoSvg color={colors.logoColor} style={{ width: "100%", height: "100%" }} />
               </LogoAnimator>
            </View>
            {serverOperating === false && (
               <Text style={styles.textBlock}>
                  {serverInfoData?.serverMessage
                     ? serverInfoData?.serverMessage
                     : "No se puede conectar con el servidor, intenta mas tarde y si el problema persiste actualiza la app o buscanos en las redes sociales para saber si hubo algún problema"}
               </Text>
            )}
            {serverInfoData?.versionIsCompatible === false && (
               <Text style={styles.textBlock}>Debes actualizar la app.</Text>
            )}
            {__DEV__ && showDebugButtons && (
               <>
                  <ButtonStyled
                     color={colors.textLogin}
                     style={styles.button}
                     onPress={() => removeFromDevice("pdfbtoken")}
                  >
                     Debug button
                  </ButtonStyled>
               </>
            )}
            {showLoginButton && (
               <ButtonStyled
                  color={colors.textLogin}
                  style={styles.button}
                  onPress={handleLoginButtonClick}
               >
                  Iniciar sesión con Facebook
               </ButtonStyled>
            )}
         </View>
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
   logo: {
      position: "absolute",
      top: "30%",
      width: "55%"
   },
   textBlock: {
      textAlign: "center",
      fontFamily: currentTheme.font.medium,
      color: currentTheme.colors.textLogin,
      fontSize: 15,
      marginBottom: 150
   },
   secondTextBlock: {
      marginBottom: 65,
      textAlign: "center"
   },
   button: {
      borderColor: currentTheme.colors.textLogin
   }
});

export default LoginPage;
