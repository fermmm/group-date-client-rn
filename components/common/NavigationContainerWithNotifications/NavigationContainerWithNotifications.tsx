import React, { ComponentProps, FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { usePushNotificationRedirectWhileUsingApp } from "../../../common-tools/device-native-api/notifications/usePushNotificationRedirectWhileUsingApp";

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
