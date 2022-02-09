import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { getAppVersion } from "../../../../common-tools/device-native-api/versions/versions";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";

const VersionIndicator: FC = () => {
   const { buildVersion, codeVersion } = getAppVersion();

   const handlePress = () => {};

   return (
      <Text style={styles.text} onPress={handlePress}>
         {codeVersion}
      </Text>
   );
};

const styles: Styles = StyleSheet.create({
   text: {
      fontFamily: currentTheme.font.light,
      color: currentTheme.colors.textLogin
   }
});

export default VersionIndicator;
