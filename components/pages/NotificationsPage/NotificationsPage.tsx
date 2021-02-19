import React, { Component } from "react";
import { StyleSheet, Linking } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, List } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { currentTheme } from "../../../config";
import GraphSvg2 from "../../../assets/GraphSvg2";
import {
   Notification,
   NotificationType
} from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";

export interface NotificationsPageProps extends Themed, StackScreenProps<{}> {}
export interface NotificationsPageState {
   notifications: Notification[];
}

// TODO: Cuando se recibe aca una notificación de grupo nuevo hay que revalidar la lista de grupos y mostrar la pantalla de felicitaciones

class NotificationsPage extends Component<NotificationsPageProps, NotificationsPageState> {
   state: NotificationsPageState = {
      // TODO: Get notifications from server
      notifications: []
   };
   // TODO: Save this into local storage
   seenNotificationsIds: string[] = [];
   // TODO: Get local user from server:
   userGroups: Group[] = [];

   render(): JSX.Element {
      return (
         <>
            <BasicScreenContainer>
               <TitleText extraMarginLeft extraSize>
                  Notificaciones
               </TitleText>
               <EmptySpace height={10} />
               {this.state.notifications.map((notification, i) => {
                  const icon: string | ((color: string) => React.ReactNode) = this.getIcon(
                     notification
                  );

                  return (
                     <List.Item
                        title={notification.title}
                        description={notification.text}
                        left={props =>
                           typeof icon === "string" ? (
                              <List.Icon {...props} style={styles.optionIcon} icon={icon} />
                           ) : (
                              icon(props.color)
                           )
                        }
                        onPress={() => this.onNotificationPress(notification)}
                        style={[
                           styles.notification,
                           !this.seenNotificationsIds.includes(notification.notificationId) &&
                              styles.unseenNotification
                        ]}
                        key={i}
                     />
                  );
               })}
            </BasicScreenContainer>
         </>
      );
   }

   onNotificationPress(notification: Notification): void {
      const { navigate }: StackNavigationProp<Record<string, {}>> = this.props.navigation;

      switch (notification.type) {
         case NotificationType.FacebookEvent:
            Linking.openURL(notification.targetId);
            break;
         case NotificationType.Chat:
            navigate("Chat");
            break;
         case NotificationType.ContactChat:
            navigate("Chat", { contactChat: true });
            break;
         case NotificationType.Group:
            navigate("Group", {
               group: this.userGroups.find(g => g.groupId === notification.targetId)
            });
            break;
         case NotificationType.About:
            navigate("About");
            break;
      }
   }

   getIcon(notification: Notification): string | ((color: string) => React.ReactNode) {
      switch (notification.type) {
         case NotificationType.FacebookEvent:
            return "event";
         case NotificationType.Chat:
            return "forum";
         case NotificationType.ContactChat:
            return "assistant";
         case NotificationType.Group:
            return color => (
               <GraphSvg2 circleColor={color} lineColor={color} style={styles.svgIcon} />
            );
         default:
            return "notifications";
      }
   }
}

const styles: Styles = StyleSheet.create({
   profileIcon: {
      marginLeft: 4,
      marginRight: 9
   },
   optionIcon: {
      marginLeft: 5,
      marginRight: 8
   },
   svgIcon: {
      marginLeft: 6,
      marginRight: 23,
      marginTop: 9,
      width: 24
   },
   notification: {
      marginBottom: 8
   },
   unseenNotification: {
      backgroundColor: currentTheme.colors.backgroundBottomGradient,
      elevation: 6
   }
});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withTheme(withNavigation(NotificationsPage));
