import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { UseAuthentication } from "../../../../api/authentication/useAuthentication";
import { AuthenticationProvider } from "../../../../api/server/shared-tools/authentication/AuthenticationProvider";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";

interface PropsAuthenticationButtons {
   authentication: UseAuthentication;
}

// TODO: Activar botones si están las .env requeridas GOOGLE_CLIENT_ID_ANDROID, GOOGLE_CLIENT_WEB_EXPO, FACEBOOK_APP_ID y FACEBOOK_APP_NAME
// TODO: Tambien los botones se tienen que poder desactivar segun plataforma y segun la configuracion en algun lado
export const AuthenticationButtons: FC<PropsAuthenticationButtons> = ({ authentication }) => {
   const { getNewToken } = authentication;
   const { colors } = useTheme();

   const handleGoogleButtonPress = () => {
      getNewToken(AuthenticationProvider.Google);
   };

   const handleFacebookButtonPress = () => {
      getNewToken(AuthenticationProvider.Facebook);
   };

   return (
      <View>
         <ButtonStyled
            color={colors.textLogin}
            style={styles.button}
            onPress={handleGoogleButtonPress}
         >
            Iniciar sesión con Google
         </ButtonStyled>
         <ButtonStyled
            color={colors.textLogin}
            style={styles.button}
            onPress={handleFacebookButtonPress}
         >
            Iniciar sesión con Facebook
         </ButtonStyled>
      </View>
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
