import React, { Component } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { LogoSvg } from "../../../assets/LogoSvg";
import { NavigationContainerProps, NavigationScreenProp } from "react-navigation";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";
import { currentTheme } from "../../../config";
import i18n from "i18n-js";
import { login, tryGetStoredSession } from "../../../api/server/login";
import { loginWithFacebook } from "../../../api/third-party/facebook/facebook-login";

export interface LoginProps extends Themed, NavigationContainerProps { }
export interface LoginState { }

class LoginPage extends Component<LoginProps, LoginState> {
   static defaultProps: Partial<LoginProps> = {};

   async componentDidMount(): Promise<void> {
      await login(await tryGetStoredSession());
   }

   render(): JSX.Element {
      const { colors, fonts }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <this.Background useImageBackground={true}>
            <View style={styles.mainContainer}>
               <LogoSvg style={styles.logo} color={colors.logoColor} />
               <Text style={[styles.textBlock, { marginBottom: 15 }]}>
                  <Text style={{ fontWeight: "bold" }}> {i18n.t("welcome")} </Text>
                  Poly Dates es una app de citas grupales. Las citas se forman 
                  cuando se gustan varias personas formando un grupo.
               </Text>
               <Text style={[styles.textBlock, { marginBottom: 100 }]}>
                  La vas a pasar bien conociendo poliamoroses y les que quieran
                  tienen una herramienta para relacionarse en grupo sexual o afectivamente.
               </Text>
               {/* <Text style={[styles.secondTextBlock, { color: colors.textLogin, fontFamily: fonts.light }]}>
                  Con esta herramienta no se busca el lucro y es de código abierto, perfeccionada
                  con la comunidad.
               </Text> */}
               <ButtonStyled
                  color={colors.textLogin}
                  style={{ borderColor: colors.textLogin }}
                  onPress={() => navigate("Main")}
               >
                  App UI
               </ButtonStyled>
               <ButtonStyled
                  color={colors.textLogin}
                  style={{ borderColor: colors.textLogin }}
                  // onPress={() => navigate("Questions")}
                  onPress={() => navigate("RegistrationForms")}
               >
                  Nueva cuenta UI
               </ButtonStyled>
               <ButtonStyled
                  color={colors.textLogin}
                  style={{ borderColor: colors.textLogin }}
                  onPress={async () => login(await loginWithFacebook())}
               >
                  Comenzar
               </ButtonStyled>
            </View>
         </this.Background>
      );
   }

   Background(props: { children?: JSX.Element, useImageBackground: boolean }): JSX.Element {
      if (props.useImageBackground) {
         return (
            <ImageBackground 
               source={currentTheme.backgroundImage} 
               style={styles.background}
            >
               {props.children}
            </ImageBackground>
         );
      } else {
         return (
            <LinearGradient
               colors={[currentTheme.colors.specialBackground1, currentTheme.colors.specialBackground2]}
               style={styles.background}
               start={[0, 0.5]}
               end={[0, 1.3]}
            >
               {props.children}
            </LinearGradient>
         );
      }
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: 36,
   },
   background: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
   },
   logo: {
      position: "absolute",
      top: "15%",
      width: "35%",
   },
   textBlock: {
      textAlign: "center",
      fontFamily: currentTheme.fonts.light,
      color: currentTheme.colors.textLogin
   },
   secondTextBlock: {
      marginBottom: 65,
      textAlign: "center",
   }
});

export default withTheme(LoginPage);
