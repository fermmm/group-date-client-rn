import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import NewUsersNotificationSelector from "../../../common/NewUsersNotificationSelector/NewUsersNotificationSelector";
import { currentTheme } from "../../../../config";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { useUser, useUserPropsMutation } from "../../../../api/server/user";
import { useFacebookToken } from "../../../../api/third-party/facebook/facebook-login";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import {
   loadFromDevice,
   saveOnDevice
} from "../../../../common-tools/device-native-api/storage/storage";
import { useNavigation } from "../../../../common-tools/navigation/useNavigation";

interface PropsNoMoreUsersMessage {
   onViewDislikedUsersPress: () => void;
}

const NoMoreUsersMessage: FC<PropsNoMoreUsersMessage> = ({ onViewDislikedUsersPress }) => {
   const defaultValue = 1;
   const [sendNotificationChecked, setSendNotificationChecked] = useState(true);
   const [sendNewUsersNotification, setSendNewUsersNotification] = useState<number>(null);
   const { colors } = useTheme();
   const { token } = useFacebookToken();
   const { data: user } = useUser();
   const { mutate: mutateUser } = useUserPropsMutation(null, { autoInvalidateQueries: false });
   const { navigate } = useNavigation();

   // Effect to mutate the server when the UI changes
   useEffect(() => {
      if (user == null || sendNewUsersNotification == null) {
         return;
      }

      if (!sendNotificationChecked && user.sendNewUsersNotification !== 0) {
         mutateUser({ props: { sendNewUsersNotification: 0 }, token });
         saveOnDevice("noUsersLastSelected", "0");
         return;
      }

      if (sendNotificationChecked && user.sendNewUsersNotification != sendNewUsersNotification) {
         mutateUser({ props: { sendNewUsersNotification }, token });
         saveOnDevice("noUsersLastSelected", String(sendNewUsersNotification));
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
         loadFromDevice("noUsersLastSelected").then(value => {
            setSendNotificationChecked(true);
            setSendNewUsersNotification(value != null ? Number(value) : defaultValue);
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
               checked={sendNotificationChecked}
               amountSelected={sendNewUsersNotification}
               onAmountChange={v => setSendNewUsersNotification(v)}
               onCheckChange={() => setSendNotificationChecked(!sendNotificationChecked)}
            />
            <EmptySpace />
            <Text style={styles.text}>
               Si te sirve puedes repasar a lxs usuarixs que dejaste de lado:
            </Text>
            <Button mode="text" onPress={onViewDislikedUsersPress}>
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
