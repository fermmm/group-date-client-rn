import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import NewUsersNotificationSelector from "../../../common/NewUsersNotificationSelector/NewUsersNotificationSelector";
import { currentTheme } from "../../../../config";
import { sendUserProps, useUser } from "../../../../api/server/user";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";

interface PropsNoMoreUsersMessage {
   onViewDislikedUsersPress: () => void;
}

const NoMoreUsersMessage: FC<PropsNoMoreUsersMessage> = ({ onViewDislikedUsersPress }) => {
   const [sendNewUsersNotification, setSendNewUsersNotification] = useState<number>(1);
   let {
      value: sendNotificationChecked,
      setValue: setSendNotificationChecked,
      refresh: refreshSendNotificationChecked
   } = useLocalStorage<boolean>(LocalStorageKey.NewUsersNotificationTempCheckbox);
   const { token } = useAuthentication();
   const { data: user } = useUser();
   // This is currently the way to set the default value without any side effect:
   if (sendNotificationChecked === null) {
      sendNotificationChecked = true;
   }

   // Effect to mutate the server when the UI changes
   useEffect(() => {
      if (user == null || sendNewUsersNotification == null) {
         return;
      }

      sendUserProps({ props: { sendNewUsersNotification }, token }, false);
   }, [sendNewUsersNotification]);

   // Effect to update the UI when the server changes
   useEffect(() => {
      if (user == null) {
         return;
      }

      // sendNewUsersNotification default value is -1, by sending sendNewUsersNotification to 1 or more we enable the notification
      if (user.sendNewUsersNotification == null || user.sendNewUsersNotification === -1) {
         sendUserProps({ props: { sendNewUsersNotification }, token }, false);
         return;
      }

      setSendNewUsersNotification(user.sendNewUsersNotification);
   }, [user]);

   /**
    * TODO: sendNewUsersNotification should be re done with a boolean in the server and a time prop in the server.
    * Until that is implemented we show a checkbox to disable new user notifications but it's fake and has no
    * effect, it's just persisted in local storage.
    */
   const handleNewUsersNotificationChange = () => {
      setSendNotificationChecked(!sendNotificationChecked);
      refreshSendNotificationChecked();
   };

   if (!user) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Absolute} />;
   }

   return (
      <BasicScreenContainer>
         <View style={styles.mainContainer}>
            <Text style={styles.text}>
               Por ahora se terminaron las personas para ver, pero siempre entran más
            </Text>
            <EmptySpace />
            <Text style={styles.text}>Aquí es necesario ser pacientes</Text>
            <EmptySpace />
            <NewUsersNotificationSelector
               checked={sendNotificationChecked}
               amountSelected={sendNewUsersNotification}
               onAmountChange={v => setSendNewUsersNotification(v)}
               onCheckChange={handleNewUsersNotificationChange}
            />
            <EmptySpace />
            <Text style={styles.text}>
               No olvides entrar a dar likes cuando haya más personas y así podrás lograr que se
               forme un grupo
            </Text>
            <EmptySpace />
            <Text style={styles.text}>
               Si te sirve puedes cambiar tus preferencias de filtros o repasar a las personas que
               ocultaste:
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
