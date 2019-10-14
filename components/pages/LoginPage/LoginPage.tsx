import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { LogoSvg } from "../../../assets/LogoSvg";
import { NavigationContainerProps, NavigationScreenProp } from "react-navigation";
import ButtonStyled from "../../common/ButtonStyled/ButtonStyled";

export interface LoginProps extends Themed, NavigationContainerProps { }
export interface LoginState { }

class LoginPage extends Component<LoginProps, LoginState> {
   static defaultProps: Partial<LoginProps> = {};

   render(): JSX.Element {
      const { colors, fonts }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <LinearGradient
            colors={[colors.background, colors.background2]}
            style={styles.mainContainer}
            start={[0, 0.5]}
            end={[0, 1.3]}
         >
            <View style={styles.mainContainer}>
               <LogoSvg style={styles.logo} color={colors.logoColor} />
               <Text style={[styles.textBlock, { color: colors.textLogin, fontFamily: fonts.light }]}>
                  <Text style={{ fontWeight: "bold" }}> ¡Bienvenide! </Text>
                  Poly Dates es una app de citas gruaples, se forma una cita cuando se gustan varies
                  entre todes. La idea es pasarla genial conociendo poliamoroses y les que quieran
                  tengan una herramienta para relacionarse en grupo sexualmente y/o afectivamente.
               </Text>
               <Text style={[styles.secondTextBlock, { color: colors.textLogin, fontFamily: fonts.light }]}>
                  Con esta herramienta no se busca el lucro y es de código abierto, perfeccionada
                  con la comunidad.
               </Text>
               <ButtonStyled
                  color={colors.textLogin}
                  style={{ borderColor: colors.textLogin }}
                  onPress={() => navigate("Main")}
               >
                  Entrar
               </ButtonStyled>
               <ButtonStyled
                  color={colors.textLogin}
                  style={{ borderColor: colors.textLogin }}
                  onPress={() => navigate("Questions")}
                  // onPress={() => navigate("RegistrationForms")}
               >
                  Nueva cuenta
               </ButtonStyled>
            </View>
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
      padding: 18,
   },
   logo: {
      position: "absolute",
      top: "15%",
      width: "35%",
   },
   textBlock: {
      marginBottom: 15,
      textAlign: "center",
   },
   secondTextBlock: {
      marginBottom: 65,
      textAlign: "center",
   }
});

export default withTheme(LoginPage);
