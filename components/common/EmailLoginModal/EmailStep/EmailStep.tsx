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
   title?: string;
   onSubmit: (email: string) => void;
   onBackPress: () => void;
}

const EmailStep: FC<PropsEmailStep> = props => {
   const { onSubmit, onBackPress, title } = props;
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

   const handleContinueButton = async () => {
      if (getEmailError() != null) {
         return;
      }

      onSubmit(email);
   };

   return (
      <View style={styles.stepContainer}>
         {title != null && <TitleText style={styles.title}>{title}</TitleText>}
         <TextInputExtended
            title="Tu email"
            errorText={getEmailError()}
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={styles.input}
         />
         <Button
            onPress={handleContinueButton}
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
   title: {},
   input: {
      backgroundColor: currentTheme.colors.background2
   }
});

export default EmailStep;
