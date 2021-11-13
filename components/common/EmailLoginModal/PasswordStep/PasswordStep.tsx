import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import TextInputExtended from "../../TextInputExtended/TextInputExtended";
import { ViewTouchable } from "../../ViewTouchable/ViewTouchable";

export interface PropsPasswordStep {
   previousPassword?: string;
   onSubmit: (password: string) => void;
   onBackPress: () => void;
   onForgotPasswordPress?: () => void;
   showLoadingAnimation?: boolean;
}

const PasswordStep: FC<PropsPasswordStep> = props => {
   const { onSubmit, onBackPress, onForgotPasswordPress, previousPassword, showLoadingAnimation } =
      props;
   const [password, setPassword] = useState<string>(null);
   const theme = useTheme();

   const getPasswordError = () => {
      if (!password || password.length < 1) {
         return "Debes completar este campo";
      }

      if (previousPassword && password !== previousPassword) {
         return "Las contraseñas no coinciden";
      }

      return null;
   };

   if (showLoadingAnimation) {
      return <LoadingAnimation />;
   }

   return (
      <View style={styles.stepContainer}>
         <TextInputExtended
            title={previousPassword == null ? "Contraseña" : "Vuelve a escribir la contraseña"}
            errorText={getPasswordError()}
            mode="outlined"
            value={password}
            onChangeText={t => setPassword(t)}
            secureTextEntry
            style={styles.input}
         />
         {onForgotPasswordPress != null && (
            <ViewTouchable
               style={styles.buttonForgotPasswordContainer}
               onPress={onForgotPasswordPress}
            >
               <Text style={styles.buttonForgotPassword}>Me olvide la contraseña</Text>
            </ViewTouchable>
         )}
         <Button
            onPress={() => (getPasswordError() != null ? null : onSubmit(password))}
            mode="outlined"
            color={theme.colors.accent2}
            style={[styles.button, { marginBottom: 10 }]}
         >
            Continuar
         </Button>
         <Button
            onPress={onBackPress}
            mode="outlined"
            color={theme.colors.accent2}
            style={styles.button}
         >
            Volver
         </Button>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   stepContainer: {
      paddingLeft: 20,
      paddingRight: 20
   },
   button: {
      borderColor: currentTheme.colors.accent2,
      minWidth: 180
   },
   buttonForgotPassword: {
      color: currentTheme.colors.accent2,
      fontSize: 15,
      paddingLeft: 5
   },
   buttonForgotPasswordContainer: {
      marginBottom: 15
   },
   input: {
      backgroundColor: currentTheme.colors.background2
   }
});

export default PasswordStep;
