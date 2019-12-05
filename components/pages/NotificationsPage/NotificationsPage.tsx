import React, { Component } from "react";
import { StyleSheet, Linking } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, List } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import { NavigationScreenProp, withNavigation, NavigationInjectedProps } from "react-navigation";
import { currentTheme } from "../../../config";
import { getGroups } from "../../../server-api/groups";
import GraphSvg2 from "../../../assets/GraphSvg2";

export interface NotificationsPageProps extends Themed, NavigationInjectedProps { }
export interface NotificationsPageState {
   notifications: Notification[];
}

class NotificationsPage extends Component<NotificationsPageProps, NotificationsPageState> {
   state: NotificationsPageState = {
      notifications: [
         {
            uiTarget: UITarget.FacebookEvent,
            redirectPath: "https://www.facebook.com/events/1770869566553161",
            seen: false,
            title: "Nuevo evento por tu zona",
            text: "Socializala #26 ~ Amor Libre Argentina",
            date: new Date()
         },
         {
            uiTarget: UITarget.Group,
            seen: false,
            title: "¡Estas en una cita grupal!",
            text: "Felicitaciones, ¡estas en una cita grupal!, toca para verla",
            date: new Date()
         },
         {
            uiTarget: UITarget.Chat,
            seen: true,
            title: "Tenes nuevos mensajes",
            text: "Hay nuevos mensajes en el chat grupal de tu cita",
            date: new Date()
         },
         {
            uiTarget: UITarget.Chat,
            seen: true,
            title: "Tenes nuevos mensajes",
            text: "Hay nuevos mensajes en el chat grupal de tu cita",
            date: new Date()
         },
         {
            uiTarget: UITarget.ContactChat,
            seen: true,
            title: "Nuevo mensaje de contacto",
            text: "Te escribieron los desarrolladores de la app. Toca para ver",
            date: new Date()
         },
         {
            uiTarget: UITarget.About,
            seen: true,
            title: "¡Bienvenide a la app!",
            text: "Acabamos de lanzar la app, toca si queres saber que hay detrás.",
            date: new Date()
         },
      ]
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <>
            <BasicScreenContainer>
               <TitleText extraMarginLeft extraSize>
                  Notificaciones
               </TitleText>
               <EmptySpace height={10} />
               {
                  this.state.notifications.map((notification, i) => {
                     const icon: string | ((color: string) => React.ReactNode) = this.getIcon(notification);

                     return (
                        <List.Item
                           title={notification.title}
                           description={notification.text}
                           left={props =>
                              typeof icon === "string" ? 
                                 <List.Icon
                                    {...props}
                                    style={styles.optionIcon}
                                    icon={icon}
                                 />
                              :
                                 icon(props.color)
                           }
                           onPress={() => this.onNotificationPress(notification)}
                           style={[styles.notification, !notification.seen && styles.unseenNotification]}
                           key={i}
                        />
                     );
                  })
               }
            </BasicScreenContainer>
         </>
      );
   }

   onNotificationPress(notification: Notification): void {
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

      switch (notification.uiTarget) {
         case UITarget.FacebookEvent:
            Linking.openURL(notification.redirectPath);
            break;
         case UITarget.Chat:
            navigate("Chat");
            break;
         case UITarget.ContactChat:
            navigate("Chat", { contactChat: true });
            break;
         case UITarget.Group:
            navigate("Group", { group: getGroups()[0] });
            break;
         case UITarget.About:
            navigate("About");
            break;
      }
   }

   getIcon(notification: Notification): string | ((color: string) => React.ReactNode) {      
      switch (notification.uiTarget) {
         case UITarget.FacebookEvent:
            return "event";
         case UITarget.Chat:
            return "forum";
         case UITarget.ContactChat:
            return "assistant";
         case UITarget.Group:
            return (color) => <GraphSvg2 circleColor={color} lineColor={color} style={styles.svgIcon} />;
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
   },
});

export interface Notification {
   uiTarget: UITarget;
   seen: boolean;
   title: string;
   text: string;
   redirectPath?: string;
   date: Date;
}

export enum UITarget {
   None,
   Group,
   Chat,
   ContactChat,
   FacebookEvent,
   About
}

export default withNavigation(withTheme(NotificationsPage));
