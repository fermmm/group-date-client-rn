import I18n from "i18n-js";
import React, { FC } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import {
   COMMUNITY_GUIDELINES_URL,
   PRIVACY_POLICY_URL,
   TERMS_AND_CONDITIONS_URL
} from "../../../../.env.config";

interface PropsLegalLinks {
   visible?: boolean;
   loginPageMode?: boolean;
}

const LegalLinks: FC<PropsLegalLinks> = props => {
   const { visible = true, loginPageMode } = props;

   if (visible !== true) {
      return null;
   }

   const { colors } = useTheme();

   const fontColor = loginPageMode ? colors.textLogin : colors.text;

   const handlePrivacyPress = () => Linking.openURL(PRIVACY_POLICY_URL);
   const handleCommunityPress = () => Linking.openURL(COMMUNITY_GUIDELINES_URL);
   const handleTermsPress = () => Linking.openURL(TERMS_AND_CONDITIONS_URL);

   return (
      <View style={styles.mainContainer}>
         <Text style={[styles.text, { color: fontColor }]}>
            {loginPageMode ? `${I18n.t("If you continue you agree to our")}: \n` : ""}
            <Text
               style={[styles.textClickable, , { color: fontColor }]}
               onPress={handlePrivacyPress}
            >
               {I18n.t("privacy policy")}
            </Text>
            {loginPageMode ? ", " : "\n\n"}
            <Text
               style={[styles.textClickable, { color: fontColor }]}
               onPress={handleCommunityPress}
            >
               {I18n.t("community guidelines")}
            </Text>{" "}
            {loginPageMode ? `${I18n.t("and")} ` : "\n\n"}
            <Text style={[styles.textClickable, { color: fontColor }]} onPress={handleTermsPress}>
               {I18n.t("terms of use")}
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
      textAlign: "center"
   },
   textClickable: {
      fontFamily: currentTheme.font.medium,
      textDecorationLine: "underline",
      textAlign: "center"
   }
});

export default LegalLinks;
