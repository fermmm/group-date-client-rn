import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { formValidators } from "../../../../common-tools/forms/formValidators";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import TextInputExtended from "../../TextInputExtended/TextInputExtended";
import TitleText from "../../TitleText/TitleText";

export interface PropsEmailStep {
   onSubmit: (email: string) => void;
   onBackPress: () => void;
   isForgotPasswordStep?: boolean;
}

const EmailStep: FC<PropsEmailStep> = props => {
   const { onSubmit, onBackPress, isForgotPasswordStep } = props;
   const [email, setEmail] = useState<string>(null);
   const theme = useTheme();

   const getEmailError = () => {
      if (!email || email.length < 5) {
         return "Debes completar este campo";
      }

      if (!formValidators.email(email).result.isValid) {
         return "Debes ingresar un email válido";
      }

      return null;
   };

   return (
      <View style={styles.stepContainer}>
         {isForgotPasswordStep === true && (
            <TitleText style={styles.title}>Olvide la contraseña</TitleText>
         )}
         <TextInputExtended
            title="Tu email"
            errorText={getEmailError()}
            mode="outlined"
            value={email}
            onChangeText={t => setEmail(t)}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
         />
         <Button
            onPress={() => (getEmailError() != null ? null : onSubmit(email))}
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
   title: {}
});

export default EmailStep;
