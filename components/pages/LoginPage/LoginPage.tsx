import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Constants from "expo-constants";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../assets/LogoSvg";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";
import { currentTheme } from "../../../config";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useIsFocused } from "@react-navigation/native";
import { useServerInfo } from "../../../api/server/server-info";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { useUserProfileStatus } from "../../../api/server/user";
import { userHasFinishedRegistration } from "../../../api/tools/userTools";
import { LogoAnimator } from "./LogoAnimator/LogoAnimator";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useSendPropsToUpdateAtLogin } from "./tools/useSendPropsToUpdateAtLogin";
import { usePushNotificationPressRedirect } from "../../../common-tools/device-native-api/notifications/usePushNotificationPressRedirect";
import BackgroundArtistic from "../../common/BackgroundArtistic/BackgroundArtistic";
import { showBetaVersionMessage } from "../../../common-tools/messages/showBetaVersionMessage";
import { AuthenticationButtons } from "./AuthenticationButtons/AuthenticationButtons";
import { removeAllLocalStorage } from "../../../common-tools/device-native-api/storage/removeAllLocalStorage";

const LoginPage: FC = () => {
   // These are constants for debugging:
   const showDebugButtons: boolean = false;

   const [logoAnimCompleted, setLogoAnimCompleted] = useState(false);
   const { colors } = useTheme();
   const { navigateWithoutHistory, navigate } = useNavigation();
   const { redirectFromPushNotificationPress } = usePushNotificationPressRedirect();
   const isFocused = useIsFocused();
   const { data: serverInfoData, isLoading: serverInfoLoading, error } = useServerInfo();
   const serverOperating: boolean = serverInfoLoading
      ? null
      : serverInfoData?.serverOperating ?? error == null;
   const canUseServer = serverOperating && serverInfoData?.versionIsCompatible;

   // Authenticate user
   const auth = useAuthentication(null, { checkTokenIsValid: true });

   // If we have a valid user token and finished updating the login props we check if there is any user
   // property missing (caused by unfinished registration or new props)
   const { data: profileStatusData, error: profileStatusError } = useUserProfileStatus({
      config: { enabled: auth.tokenIsValid === true && canUseServer === true },
      requestParams: { token: auth.token }
   });

   const finishedRegistration = userHasFinishedRegistration(profileStatusData);

   // If we have a valid user we can send the user props that needs to be updated at each login
   const sendLoginPropsCompleted = useSendPropsToUpdateAtLogin(auth.token, serverInfoData, {
      enabled: profileStatusData != null
   });

   // If the user has props missing redirect to RegistrationForms otherwise redirect to Main or notification press
   useEffect(() => {
      if (
         profileStatusData == null ||
         !logoAnimCompleted ||
         !isFocused ||
         !sendLoginPropsCompleted
      ) {
         return;
      }

      if (!finishedRegistration) {
         navigateWithoutHistory("RegistrationForms");
      } else {
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
   }, [profileStatusData, sendLoginPropsCompleted, logoAnimCompleted]);

   const showAuthenticationButtons: boolean =
      profileStatusError ||
      (canUseServer &&
         (auth.token == null || auth.tokenIsValid === false) &&
         !auth.isLoading &&
         !serverInfoLoading);

   const showLoadingAnimation: boolean =
      canUseServer &&
      logoAnimCompleted &&
      !showAuthenticationButtons &&
      !profileStatusError &&
      (auth.isLoading || serverInfoLoading || !profileStatusData);

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
            {showDebugButtons && (
               <>
                  <ButtonStyled
                     color={colors.textLogin}
                     style={styles.button}
                     onPress={() => {
                        removeAllLocalStorage();
                     }}
                  >
                     Debug button
                  </ButtonStyled>
               </>
            )}
            <AuthenticationButtons show={showAuthenticationButtons} authentication={auth} />
            <Text style={styles.text}>Versión: {Constants.manifest.version}</Text>
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
   text: {
      fontFamily: currentTheme.font.light,
      color: currentTheme.colors.textLogin
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
