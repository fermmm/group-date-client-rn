import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { ServerInfoResponse } from "../../../../api/server/shared-tools/endpoints-interfaces/server-info";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";

interface PropsAppUpdateMessage {
   serverInfo: ServerInfoResponse;
}

const AppUpdateMessage: FC<PropsAppUpdateMessage> = ({ serverInfo }) => {
   if (serverInfo?.buildVersionIsCompatible === false) {
      return <Text style={styles.textBlock}>Debes actualizar la app en Google Play</Text>;
   }

   if (serverInfo?.codeVersionIsCompatible === false) {
      return (
         <Text style={styles.textBlock}>
            Debes actualizar la app, reiniciala para que se actualice
         </Text>
      );
   }

   return null;
};

const styles: Styles = StyleSheet.create({
   textBlock: {
      textAlign: "center",
      fontFamily: currentTheme.font.medium,
      color: currentTheme.colors.textLogin,
      fontSize: 15,
      marginBottom: 150
   }
});

export default AppUpdateMessage;
