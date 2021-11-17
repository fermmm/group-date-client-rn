import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import ConsoleProvider from "react-native-dev-console";
import { getAppVersion } from "../../../../common-tools/device-native-api/versions/versions";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { ViewTouchable } from "../../../common/ViewTouchable/ViewTouchable";

const VersionIndicator: FC = () => {
   const { buildVersion, codeVersion } = getAppVersion();
   const [consoleOpen, setConsoleOpen] = useState(false);

   const handlePress = () => {
      setConsoleOpen(true);
   };

   return (
      <>
         <ViewTouchable onPress={handlePress}>
            <Text style={styles.text}>{codeVersion}</Text>
         </ViewTouchable>
         <View
            pointerEvents="box-none"
            style={[
               styles.consoleContainer,
               {
                  opacity: consoleOpen ? 1 : 0
               }
            ]}
         >
            <ConsoleProvider />
         </View>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   text: {
      fontFamily: currentTheme.font.light,
      color: currentTheme.colors.textLogin
   },
   consoleContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      flex: 1
   }
});

export default VersionIndicator;
