import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import NewUsersNotificationSelector from "../../../common/NewUsersNotificationSelector/NewUsersNotificationSelector";
import { currentTheme } from "../../../../config";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { sendUserProps, useUser } from "../../../../api/server/user";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import {
   loadFromDevice,
   saveOnDevice
} from "../../../../common-tools/device-native-api/storage/storage";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";

interface PropsNoMoreUsersMessage {
   onViewDislikedUsersPress: () => void;
}

const NoMoreUsersMessage: FC<PropsNoMoreUsersMessage> = ({ onViewDislikedUsersPress }) => {
   const defaultValue = 1;
   const [sendNotificationChecked, setSendNotificationChecked] = useState(true);
   const [sendNewUsersNotification, setSendNewUsersNotification] = useState<number>(null);
   const { colors } = useTheme();
   const { token } = useAuthentication();
   const { data: user } = useUser();

   // Effect to mutate the server when the UI changes
   useEffect(() => {
      if (user == null || sendNewUsersNotification == null) {
         return;
      }

      if (!sendNotificationChecked && user.sendNewUsersNotification !== 0) {
         sendUserProps({ props: { sendNewUsersNotification: 0 }, token }, false);
         saveOnDevice("noUsersLastSelected", 0);
         return;
      }

      if (sendNotificationChecked && user.sendNewUsersNotification != sendNewUsersNotification) {
         sendUserProps({ props: { sendNewUsersNotification }, token }, false);
         saveOnDevice("noUsersLastSelected", sendNewUsersNotification);
      }
   }, [sendNewUsersNotification, sendNotificationChecked]);

   // Effect to update the UI when the server changes
   useEffect(() => {
      if (user == null || user.sendNewUsersNotification == null) {
         return;
      }

      if (user.sendNewUsersNotification === 0) {
         setSendNotificationChecked(false);
         return;
      }

      if (user.sendNewUsersNotification === -1) {
         loadFromDevice<number>("noUsersLastSelected").then(value => {
            setSendNotificationChecked(true);
            setSendNewUsersNotification(value != null ? value : defaultValue);
         });
         return;
      }

      setSendNotificationChecked(true);
      setSendNewUsersNotification(user.sendNewUsersNotification);
   }, [user]);

   if (!user) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Absolute} />;
   }

   return (
      <BasicScreenContainer>
         <View style={styles.mainContainer}>
            <Text style={styles.text}>
               Eso es todo por ahora, en poco tiempo habrá más personas, todos los días entra gente.
            </Text>
            <EmptySpace />
            <NewUsersNotificationSelector
               checked={sendNotificationChecked}
               amountSelected={sendNewUsersNotification}
               onAmountChange={v => setSendNewUsersNotification(v)}
               onCheckChange={() => setSendNotificationChecked(!sendNotificationChecked)}
            />
            <EmptySpace />
            <Text style={styles.text}>
               Si te sirve puedes repasar a las personas que ocultaste:
            </Text>
            <Button mode="outlined" onPress={onViewDislikedUsersPress} style={{ marginTop: 20 }}>
               Repasar ocultadxs
            </Button>
         </View>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 20
   },
   text: {
      fontSize: 17,
      fontFamily: currentTheme.font.light
   }
});

export default NoMoreUsersMessage;
