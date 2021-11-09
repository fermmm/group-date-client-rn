import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import TitleText from "../../TitleText/TitleText";
import { ViewTouchable } from "../../ViewTouchable/ViewTouchable";

export interface PropsMainStep {
   onLogin: () => void;
   onSignUp: () => void;
   onForgotPassword: () => void;
}

const MainStep: FC<PropsMainStep> = props => {
   const { onLogin, onSignUp, onForgotPassword } = props;
   const theme = useTheme();

   return (
      <View style={styles.stepContainer}>
         <TitleText style={styles.title}>Iniciar sesión con email</TitleText>
         <Button
            onPress={onLogin}
            mode="outlined"
            color={theme.colors.accent2}
            style={[styles.button, { marginBottom: 20 }]}
         >
            Ya tengo cuenta
         </Button>
         <Button
            onPress={onSignUp}
            mode="outlined"
            color={theme.colors.accent2}
            style={styles.button}
         >
            Registrarme
         </Button>
         <ViewTouchable style={styles.buttonForgotPasswordContainer} onPress={onForgotPassword}>
            <Text style={styles.buttonForgotPassword}>Me olvide la contraseña</Text>
         </ViewTouchable>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   stepContainer: {
      paddingLeft: 20,
      paddingRight: 20
   },
   title: {
      marginBottom: 26
   },
   buttonForgotPassword: {
      color: currentTheme.colors.accent2,
      fontSize: 15,
      paddingLeft: 5
   },
   buttonForgotPasswordContainer: {
      marginTop: 25,
      marginBottom: 15
   }
});

export default MainStep;
