import React, { FC } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import { Text } from "react-native-paper";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";
import { WEBSITE_URL } from "../../../../.env.config";

interface PropsAppUpdateMessage {
   serverInfo: ServerInfoResponse;
}

const AppUpdateMessage: FC<PropsAppUpdateMessage> = ({ serverInfo }) => {
   const { colors } = useTheme();

   if (serverInfo?.buildVersionIsCompatible === false) {
      return (
         <View style={styles.mainContainer}>
            <Text style={styles.textBlock}>
               Debes actualizar la app en {Platform.OS === "ios" ? "App Store" : "Google Play"}
            </Text>
            <ButtonStyled
               color={colors.textLogin}
               style={styles.button}
               contentStyle={styles.buttonContent}
               onPress={() => {
                  if (Platform.OS === "ios") {
                     // TODO: Implement a direct link to the app store
                     Linking.openURL(WEBSITE_URL);
                  } else {
                     Linking.openURL(`market://details?id=${Application.applicationId}`);
                  }
               }}
            >
               Ir a {Platform.OS === "ios" ? "App Store" : "Google Play"}
            </ButtonStyled>
         </View>
      );
   }

   if (serverInfo?.codeVersionIsCompatible === false) {
      return (
         <View style={styles.mainContainer}>
            <Text style={styles.textBlock}>
               Debes actualizar la app, reiniciala para que se actualice
            </Text>
            <ButtonStyled
               color={colors.textLogin}
               style={styles.button}
               contentStyle={styles.buttonContent}
               onPress={Updates.reloadAsync}
            >
               Reiniciar
            </ButtonStyled>
         </View>
      );
   }

   return null;
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "100%"
   },
   textBlock: {
      textAlign: "center",
      fontFamily: currentTheme.font.medium,
      color: currentTheme.colors.textLogin,
      fontSize: 15,
      marginBottom: 40
   },
   button: {
      borderColor: currentTheme.colors.textLogin,
      width: "100%",
      marginBottom: 80
   },
   buttonContent: {
      justifyContent: "center"
   }
});

export default AppUpdateMessage;
