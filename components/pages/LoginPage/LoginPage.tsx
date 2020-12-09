import React, { Component, FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import Constants from "expo-constants";
import { withTheme } from "react-native-paper";

import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { LogoSvg } from "../../../assets/LogoSvg";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";
import { currentTheme } from "../../../config";
import i18n from "i18n-js";
import { login } from "../../../api/server/login";
import { loginWithFacebook } from "../../../api/third-party/facebook/facebook-login";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useNavigation } from "@react-navigation/native";
import { useServerHandshake } from "../../../api/server/handshake";
import { LogoAnimator } from "./LogoAnimator/LogoAnimator";
import { LogoAnimator2 } from "./LogoAnimator/LogoAnimator2";

const LoginPage: FC = () => {
   const { colors, font: fonts } = useTheme();
   const { navigate } = useNavigation();
   const [color, setColor] = useState(colors.logoColor);

   // Send the version of the client to get information about possible updates needed and service status
   const { data, isLoading } = useServerHandshake({ version: Constants.manifest.version });

   return (
      <Background useImageBackground={true}>
         <View style={styles.mainContainer}>
            <View style={data?.serverOperating === false ? styles.logo : styles.logoBig}>
               <LogoAnimator2>
                  <LogoSvg color={color} style={{ width: "100%", height: "100%" }} />
               </LogoAnimator2>
            </View>
            {data?.serverOperating === false && (
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
                  {data.serverMessage && (
                     <Text
                        style={[
                           styles.textBlock,
                           {
                              marginBottom: 100
                           }
                        ]}
                     >
                        {data.serverMessage}
                     </Text>
                  )}
               </>
            )}
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
            {!isLoading && data?.serverOperating && (
               <ButtonStyled
                  color={colors.textLogin}
                  style={{
                     borderColor: colors.textLogin
                  }}
                  onPress={async () => login(await loginWithFacebook())}
               >
                  Comenzar
               </ButtonStyled>
            )}
         </View>
      </Background>
   );
};

function Background(props: { children?: JSX.Element; useImageBackground: boolean }): JSX.Element {
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
