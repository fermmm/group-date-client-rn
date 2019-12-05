import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import NewUsersNotificationSelector from "../../../common/NewUsersNotificationSelector/NewUsersNotificationSelector";
import { currentTheme } from "../../../../config";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";

export interface NoMoreUsersProps extends Themed { }
export interface NoMoreUsersState {
   sendNotification: boolean;
   ammountNotification: number;
}

class NoMoreUsersMessage extends Component<NoMoreUsersProps, NoMoreUsersState> {
   static defaultProps: Partial<NoMoreUsersProps> = {};
   state: NoMoreUsersState = {
      sendNotification: true,
      ammountNotification: 3
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { sendNotification, ammountNotification }: Partial<NoMoreUsersState> = this.state;

      return (
         <LinearGradient
            style={{ flex: 1 }}
            locations={[0.7, 1]}
            colors={[
               color(currentTheme.colors.background).string(),
               color(currentTheme.colors.backgroundBottomGradient).alpha(1).string(),
            ]}
         >
            <View style={styles.mainContainer}>
               <Text style={styles.text}>
                  En poco tiempo vas a ver más gente acá, todos los días hay usuaries nuevos.
               </Text>
               <EmptySpace />
               <NewUsersNotificationSelector
                  checked={sendNotification}
                  ammountSelected={ammountNotification}
                  onAmmountChange={(v) => this.setState({ ammountNotification: v })}
                  onCheckChange={() => this.setState({ sendNotification: !sendNotification })}
               />
               <EmptySpace />
               <Text style={styles.text}>
                  Si te sirve podes repasar a les usuaries que dejaste de lado:
               </Text>
               <Button
                  mode="text"
                  onPress={() => console.log("press")}
               >
                  Repasar usuaries
               </Button>
            </View>
         </LinearGradient>
      );
   }
}

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
      fontFamily: currentTheme.fonts.light
   }
});

export default withTheme(NoMoreUsersMessage);
