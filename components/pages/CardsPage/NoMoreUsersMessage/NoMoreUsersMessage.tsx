import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import NewUsersNotificationSelector from "../../../common/NewUsersNotificationSelector/NewUsersNotificationSelector";
import { currentTheme } from "../../../../config";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";

const NoMoreUsersMessage: FC = () => {
   const [sendNotification, setSendNotification] = useState(true);
   const [amountNotification, setAmountNotification] = useState(3);
   const { colors } = useTheme();

   return (
      <LinearGradient
         style={{ flex: 1 }}
         locations={[0.7, 1]}
         colors={[
            color(colors.background).string(),
            color(colors.backgroundBottomGradient).alpha(1).string()
         ]}
      >
         <View style={styles.mainContainer}>
            <Text style={styles.text}>
               En poco tiempo vas a ver más gente aquí, todos los días hay usuarixs nuevxs.
            </Text>
            <EmptySpace />
            <NewUsersNotificationSelector
               checked={sendNotification}
               amountSelected={amountNotification}
               onAmountChange={v => setAmountNotification(v)}
               onCheckChange={() => setSendNotification(!sendNotification)}
            />
            <EmptySpace />
            <Text style={styles.text}>
               Si te sirve podes repasar a lxs usuarixs que dejaste de lado:
            </Text>
            <Button mode="text" onPress={() => console.log("press")}>
               Repasar usuarixs
            </Button>
         </View>
      </LinearGradient>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginBottom: 150
   },
   text: {
      fontSize: 17,
      fontFamily: currentTheme.font.light
   }
});

export default NoMoreUsersMessage;
