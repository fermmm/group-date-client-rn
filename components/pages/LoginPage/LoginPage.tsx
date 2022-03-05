import React, { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../assets/LogoSvg";
import { currentTheme } from "../../../config";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useIsFocused } from "@react-navigation/native";
import { useServerInfo } from "../../../api/server/server-info";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { useUserProfileStatus } from "../../../api/server/user";
import { LogoAnimator } from "./LogoAnimator/LogoAnimator";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useSendPropsToUpdateAtLogin } from "./tools/useSendPropsToUpdateAtLogin";
import BackgroundArtistic from "../../common/BackgroundArtistic/BackgroundArtistic";
import { showIntroMessage } from "../../../common-tools/messages/showBetaVersionMessage";
import { AuthenticationButtons } from "./AuthenticationButtons/AuthenticationButtons";
import { getAppVersion } from "../../../common-tools/device-native-api/versions/versions";
import AppUpdateMessage from "./AppUpdateMessage/AppUpdateMessage";
import {
   logAnalyticsLoginStep,
   LoginStep
} from "../../../common-tools/analytics/loginPage/loginSteps";
import { analyticsLogUser } from "../../../common-tools/analytics/tools/analyticsLogUser";
import VersionIndicator from "./VersionIndicator/VersionIndicator";
import { ViewTouchable } from "../../common/ViewTouchable/ViewTouchable";
import { useShouldRedirectToRequiredPage } from "../../../common-tools/navigation/useShouldRedirectToRequiredPage";
import LegalLinks from "./LegalLinks/LegalLinks";
import LoginError from "./LoginError/LoginError";

const LoginPage: FC = () => {
   const { colors } = useTheme();
   const { navigateWithoutHistory, navigate } = useNavigation();
   const isFocused = useIsFocused();
   const { buildVersion, codeVersion } = getAppVersion();
   const { data: serverInfoData, isLoading: serverInfoLoading, error } = useServerInfo();
   const serverOperating: boolean = serverInfoLoading
      ? null
      : serverInfoData?.serverOperating ?? error == null;
   const canUseServer =
      serverOperating &&
      serverInfoData?.codeVersionIsCompatible &&
      serverInfoData.buildVersionIsCompatible;

   // Authenticate user
   const auth = useAuthentication(null, {
      checkTokenIsValid: true,
      enabled: canUseServer === true
   });

   // If we have a valid user token and finished updating the login props we check if there is any user
   // property missing (caused by unfinished registration or new props)
   const { data: profileStatusData, error: profileStatusError } = useUserProfileStatus({
      config: { enabled: auth.tokenIsValid === true && canUseServer === true },
      requestParams: { token: auth.token }
   });

   // With this we get the info required to know where to redirect after login
   const { shouldRedirectToRequiredPage, redirectToRequiredPage, shouldRedirectIsLoading } =
      useShouldRedirectToRequiredPage({
         enabled: profileStatusData != null
      });

   // If we have a valid user we can send the user props that needs to be updated at each login
   const sendLoginPropsCompleted = useSendPropsToUpdateAtLogin(auth.token, serverInfoData, {
      enabled: profileStatusData != null
   });

   // If the user has props missing redirect to RegistrationForms otherwise redirect to Main or notification press
   useEffect(() => {
      if (
         profileStatusData == null ||
         !isFocused ||
         !sendLoginPropsCompleted ||
         shouldRedirectIsLoading
      ) {
         return;
      }

      analyticsLogUser(profileStatusData.user);
      logAnalyticsLoginStep(LoginStep.LoginCompleted, { buildVersion, codeVersion });

      if (shouldRedirectToRequiredPage) {
         redirectToRequiredPage();
      } else {
         navigateWithoutHistory("Main");
         showIntroMessage();
      }
   }, [
      profileStatusData,
      sendLoginPropsCompleted,
      shouldRedirectIsLoading,
      shouldRedirectToRequiredPage
   ]);

   const showAuthenticationButtons: boolean =
      profileStatusError ||
      (canUseServer &&
         (auth.token == null || auth.tokenIsValid === false) &&
         !auth.isLoading &&
         !serverInfoLoading);

   const showLoadingAnimation: boolean =
      canUseServer &&
      !showAuthenticationButtons &&
      !profileStatusError &&
      (auth.isLoading ||
         serverInfoLoading ||
         shouldRedirectIsLoading ||
         !profileStatusData ||
         !sendLoginPropsCompleted);

   return (
      <BackgroundArtistic useImageBackground={true}>
         <View style={styles.mainContainer}>
            <LoadingAnimation
               visible={showLoadingAnimation}
               enableTimeoutButton
               timeoutButtonColor={colors.textLogin}
               onTimeoutButtonPress={auth.logout}
            />
            <View style={styles.logo}>
               <LogoAnimator>
                  <ViewTouchable onPress={() => navigate("WelcomeTour")}>
                     <LogoSvg color={colors.logoColor} style={styles.logoSvg} />
                  </ViewTouchable>
               </LogoAnimator>
            </View>
            {serverOperating === false && <LoginError error={serverInfoData?.serverMessage} />}
            <AppUpdateMessage serverInfo={serverInfoData} />
            <LegalLinks visible={showAuthenticationButtons} loginPageMode />
            <AuthenticationButtons show={showAuthenticationButtons} authentication={auth} />
            {!showAuthenticationButtons && <VersionIndicator />}
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
   looSvg: {
      width: "100%",
      height: "100%"
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
