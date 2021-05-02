import React, { ComponentProps, FC, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { NavigationContainer } from "@react-navigation/native";
import { usePushNotificationRedirectWhileUsingApp } from "../../../common-tools/device-native-api/notifications/usePushNotificationRedirectWhileUsingApp";
import {
   NotificationData,
   NotificationType
} from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { revalidate } from "../../../api/tools/useCache/useCache";

export const NavigationContainerWithNotifications: FC<
   ComponentProps<typeof NavigationContainer>
> = props => {
   const {
      navigationRef,
      onNavigationReady,
      onNavigationStateChange
   } = usePushNotificationRedirectWhileUsingApp({
      disableRedirectWhen: [
         { currentRoute: "Login" },
         { previousRoute: "Login", currentRoute: "RegistrationForms" }
      ]
   });

   useEffect(() => {
      /**
       * This handler determines how your app handles notifications that come in while the app is foregrounded
       */
      Notifications.setNotificationHandler({
         handleNotification: async event => {
            const notification = (event.request.content.data as unknown) as NotificationData;
            const currentRoute = navigationRef?.current?.getCurrentRoute().name;

            if (notification.type === NotificationType.Chat && currentRoute === "Chat") {
               return {
                  shouldShowAlert: false,
                  shouldPlaySound: false,
                  shouldSetBadge: false
               };
            }

            return {
               shouldShowAlert: true,
               shouldPlaySound: true,
               shouldSetBadge: true
            };
         }
      });

      /**
       * This listener is fired whenever a notification is received while the app is foregrounded.
       */
      const handleNotificationReceived = (event: Notifications.Notification) => {
         const notification = (event.request.content.data as unknown) as NotificationData;

         switch (notification.type) {
            case NotificationType.Chat:
               // This is a inexpensive way of updating the chat messages faster, the notification is faster than the interval based update.
               revalidate("group/chat");
               revalidate("group/chat/unread/amount");
               break;
            default:
               break;
         }

         // Keep in sync push with app notifications, otherwise a push appears and the app is not instantly updated
         revalidate("user/notifications");
      };

      const subscription = Notifications.addNotificationReceivedListener(
         handleNotificationReceived
      );

      return () => subscription.remove();
   }, []);

   return (
      <NavigationContainer
         {...props}
         ref={navigationRef}
         onReady={onNavigationReady}
         onStateChange={onNavigationStateChange}
      >
         {props.children}
      </NavigationContainer>
   );
};
