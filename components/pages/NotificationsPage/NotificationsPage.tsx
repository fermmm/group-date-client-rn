import React, { FC } from "react";
import { StyleSheet, Linking, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Button, List } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import { currentTheme } from "../../../config";
import GraphSvg2 from "../../../assets/GraphSvg2";
import {
   Notification,
   NotificationType
} from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { useNotificationsInfo } from "./tools/useNotificationsInfo";
import { useCacheRevalidationBasedOnNotifications } from "./tools/useCacheRevalidationBasedOnNotifications";

// TODO: Implementar boton de marcar todas las notificaciones como leidas usando setAllNotificationsAsSeen

const NotificationsPage: FC = () => {
   const { navigate } = useNavigation();
   const {
      notifications,
      seenNotificationsIds,
      notSeenNotifications,
      isLoading: notificationsLoading,
      setNotificationAsSeen,
      setAllNotificationsAsSeen
   } = useNotificationsInfo();
   useCacheRevalidationBasedOnNotifications(notifications);
   const isLoading = notificationsLoading || notifications == null;

   const handleNotificationPress = (notification: Notification) => {
      setNotificationAsSeen(notification.notificationId);

      switch (notification.type) {
         case NotificationType.FacebookEvent:
            Linking.openURL(notification.targetId);
            break;
         case NotificationType.Chat:
            navigate("Chat", { groupId: notification.targetId });
            break;
         case NotificationType.ContactChat:
            navigate("Chat", { contactChat: true });
            break;
         case NotificationType.Group:
            navigate("Group", { groupId: notification.targetId });
            break;
         case NotificationType.About:
            navigate("About");
            break;
      }
   };

   const handleMarkAsReadPress = () => {
      setAllNotificationsAsSeen();
   };

   const getIcon = (notification: Notification): string | ((color: string) => React.ReactNode) => {
      switch (notification.type) {
         case NotificationType.FacebookEvent:
            return "calendar";
         case NotificationType.Chat:
            return "forum";
         case NotificationType.ContactChat:
            return "assistant";
         case NotificationType.Group:
            return color => (
               <GraphSvg2 circleColor={color} lineColor={color} style={styles.svgIcon} />
            );
         case NotificationType.About:
            return "all-inclusive";
         default:
            return "bell";
      }
   };

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <BasicScreenContainer>
            {notSeenNotifications?.length > 0 && (
               <View style={styles.allAsReadButtonContainer}>
                  <Button
                     mode="text"
                     labelStyle={styles.allAsReadButtonText}
                     onPress={handleMarkAsReadPress}
                  >
                     Marcar todas como vistas
                  </Button>
               </View>
            )}
            <EmptySpace height={10} />
            {[...(notifications ?? [])].reverse().map((notification, i) => {
               const icon: string | ((color: string) => React.ReactNode) = getIcon(notification);

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
                     onPress={() => handleNotificationPress(notification)}
                     style={[
                        styles.notification,
                        !seenNotificationsIds?.includes(notification.notificationId) &&
                           styles.unseenNotification
                     ]}
                     key={notification.notificationId}
                  />
               );
            })}
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   allAsReadButtonContainer: {
      flexDirection: "row-reverse"
   },
   allAsReadButtonText: {
      textTransform: "none"
   },
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

export default NotificationsPage;
