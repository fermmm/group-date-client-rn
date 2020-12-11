import React, { FC, ReactNode, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import Constants from "expo-constants";
import { withTheme } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { LogoSvg } from "../../../assets/LogoSvg";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";
import { currentTheme } from "../../../config";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useNavigation } from "@react-navigation/native";
import { useServerHandshake } from "../../../api/server/handshake";
import { LogoAnimator } from "./LogoAnimator/LogoAnimator";
import { LogoAnimator2 } from "./LogoAnimator/LogoAnimator2";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { useServerProfileStatus } from "../../../api/server/user";
import { userFinishedRegistration } from "../../../api/tools/userTools";

const LoginPage: FC = () => {
   const showDebugButtons: boolean = true;

   const { colors } = useTheme();
   const { navigate } = useNavigation();

   // Send the version of the client to get information about possible updates needed and service status
   const { data: handshakeData, isLoading: handshakeLoading } = useServerHandshake({
      version: Constants.manifest.version
   });

   // If the service is OK get the user token
   const { token, isLoading: tokenLoading, getTokenByShowingFacebookScreen } = useFacebookToken({
      enabled: handshakeData?.serverOperating ?? false // This request is not enabled until we know server is operating
   });

   // If we have the user token we check if there is any user property missing
   const { data: profileStatusData, isLoading: profileStatusLoading } = useServerProfileStatus(
      { token },
      { enabled: token != null } // This request is not enabled until we have the token
   );

   // If the user has unfinished registration redirect to RegistrationForms otherwise redirect to Main
   useEffect(() => {
      const registrationFinished: boolean = userFinishedRegistration(profileStatusData);
      if (profileStatusData != null) {
         navigate(registrationFinished ? "Main" : "RegistrationForms");
      }
   }, [profileStatusData]);

   /**
    * The login button is visible when we don't have the token. The user clicks a button before seeing a
    * Facebook login screen.
    */
   const handleLoginButtonClick = () => {
      getTokenByShowingFacebookScreen();
   };

   return (
      <Background useImageBackground={true}>
         <View style={styles.mainContainer}>
            <LoadingAnimation visible={tokenLoading || handshakeLoading || profileStatusLoading} />
            <View style={handshakeData?.serverOperating === false ? styles.logo : styles.logoBig}>
               <LogoAnimator2>
                  <LogoSvg color={colors.logoColor} style={{ width: "100%", height: "100%" }} />
               </LogoAnimator2>
            </View>
            {handshakeData?.serverOperating === false && (
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
                        La app no esta disponible en este momento
                     </Text>
                  </Text>
                  {handshakeData.serverMessage && (
                     <Text
                        style={[
                           styles.textBlock,
                           {
                              marginBottom: 100
                           }
                        ]}
                     >
                        {handshakeData.serverMessage}
                     </Text>
                  )}
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
               </>
            )}
            {!tokenLoading && !token && handshakeData?.serverOperating && (
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
      top: "15%",
      width: "35%"
   },
   logoBig: {
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

export default withTheme(LoginPage);
