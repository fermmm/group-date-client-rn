import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { UseAuthentication } from "../../../../api/authentication/useAuthentication";
import { AuthenticationProvider } from "../../../../api/server/shared-tools/authentication/AuthenticationProvider";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";

interface PropsAuthenticationButtons {
   show: boolean;
   authentication: UseAuthentication;
}

export const AuthenticationButtons: FC<PropsAuthenticationButtons> = ({ authentication, show }) => {
   const { getNewToken } = authentication;
   const { colors } = useTheme();
   const color = colors.textLogin;
   const facebookLoginAvailable =
      Boolean(process.env.FACEBOOK_APP_ID) && Boolean(process.env.FACEBOOK_APP_NAME);
   const googleLoginAvailable = Boolean(process.env.GOOGLE_CLIENT_WEB_EXPO);

   const anyLoginAvailable = facebookLoginAvailable || googleLoginAvailable;

   const handleGoogleButtonPress = () => {
      getNewToken(AuthenticationProvider.Google);
   };

   const handleFacebookButtonPress = () => {
      getNewToken(AuthenticationProvider.Facebook);
   };

   if (!show) {
      return null;
   }

   return (
      <View style={styles.mainContainer}>
         {googleLoginAvailable && (
            <ButtonStyled
               color={color}
               style={styles.button}
               contentStyle={styles.buttonContent}
               icon={() => <Icon name={"google"} color={color} size={22} />}
               onPress={handleGoogleButtonPress}
            >
               Iniciar sesión con Google
            </ButtonStyled>
         )}
         {facebookLoginAvailable && (
            <ButtonStyled
               color={color}
               style={styles.button}
               contentStyle={styles.buttonContent}
               icon={() => <Icon name={"facebook"} color={color} size={23} />}
               onPress={handleFacebookButtonPress}
            >
               Iniciar sesión con Facebook
            </ButtonStyled>
         )}
         {!anyLoginAvailable && (
            <Text style={styles.errorText}>
               Error: No login providers configured, you must create and complete the .env file.
            </Text>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      alignItems: "center",
      width: "100%"
   },
   button: {
      borderColor: currentTheme.colors.textLogin,
      width: "100%"
   },
   buttonContent: {
      justifyContent: "flex-start"
   },
   errorText: {
      color: currentTheme.colors.textLogin
   }
});
