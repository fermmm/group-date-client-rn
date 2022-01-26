import React, { FC } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";

interface PropsLegalMessage {
   visible: boolean;
}

const LegalMessage: FC<PropsLegalMessage> = props => {
   const { visible = true } = props;

   if (!visible) {
      return null;
   }

   const handlePrivacyPress = () => Linking.openURL(process.env.PRIVACY_POLICY_URL);
   const handleCommunityPress = () => Linking.openURL(process.env.COMMUNITY_GUIDELINES_URL);
   const handleTermsPress = () => Linking.openURL(process.env.TERMS_AND_CONDITIONS_URL);

   return (
      <View style={styles.mainContainer}>
         <Text style={[styles.text]}>
            Al iniciar sesión aceptas nuestras{" "}
            <Text style={styles.textClickable} onPress={handlePrivacyPress}>
               políticas de privacidad
            </Text>
            ,{" "}
            <Text style={styles.textClickable} onPress={handleCommunityPress}>
               normas comunitarias
            </Text>{" "}
            y{" "}
            <Text style={styles.textClickable} onPress={handleTermsPress}>
               términos de uso
            </Text>
         </Text>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      marginBottom: 14
   },
   text: {
      fontSize: 12,
      fontFamily: currentTheme.font.light,
      color: currentTheme.colors.textLogin,
      textAlign: "center"
   },
   textClickable: {
      fontFamily: currentTheme.font.medium,
      color: currentTheme.colors.textLogin,
      textDecorationLine: "underline"
   }
});

export default LegalMessage;
