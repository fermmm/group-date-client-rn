import { NavigationContainerRef } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePushNotificationPress } from "./usePushNotificationPress";

/**
 * Hook to be used in the main App component with NavigationContainer to redirect the user when a push
 * notification is pressed while the app is open. Only redirects when the user route is not on the
 * parameters filter provided (if any), this is required to not redirect while loading or other
 * "non scaping" operation.
 * Also this hook updates the cache of the app notifications when receiving a new one so they keep in sync.
 */
export function usePushNotificationRedirectWhileUsingApp(
   options?: UseForegroundPushOptions
): UseForegroundPushNotificationRedirect {
   const navigationRef = useRef<NavigationContainerRef>();
   const routeNameRef = useRef<string>();
   const [redirectEnabled, setRedirectEnabled] = useState<boolean>(false);
   const { redirectFromPushNotificationPress } = usePushNotificationPress({
      redirect: (route: string, params?: object) => navigationRef?.current?.navigate(route, params)
   });

   useEffect(() => {
      if (redirectFromPushNotificationPress != null && redirectEnabled === true) {
         redirectFromPushNotificationPress();
      }
   }, [redirectFromPushNotificationPress, redirectEnabled]);

   const onNavigationReady = useCallback(() => {
      routeNameRef.current = navigationRef?.current?.getCurrentRoute().name;
   }, []);

   const onNavigationStateChange = useCallback(async () => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.current.getCurrentRoute().name;

      if (previousRouteName !== currentRouteName) {
         setRedirectEnabled(canRedirect(options, previousRouteName, currentRouteName));
      }

      // Save the current route name for later comparison
      routeNameRef.current = currentRouteName;
   }, []);

   return {
      onNavigationReady,
      onNavigationStateChange,
      navigationRef
   };
}

function canRedirect(
   options?: UseForegroundPushOptions,
   previousRute?: string,
   currentRoute?: string
): boolean {
   if (options?.disableRedirectWhen == null) {
      return true;
   }

   if (currentRoute == null && previousRute == null) {
      return false;
   }

   // Filter out the disabling routes that doesn't apply to the current case
   const matchingRules = options.disableRedirectWhen.filter(rule => {
      if (rule.previousRoute === previousRute && rule.currentRoute === currentRoute) {
         return true;
      }

      if (rule.currentRoute === currentRoute && rule.previousRoute == null) {
         return true;
      }

      if (rule.previousRoute === previousRute && rule.currentRoute == null) {
         return true;
      }

      return false;
   });

   return matchingRules.length === 0;
}

export interface UseForegroundPushNotificationRedirect {
   onNavigationReady: () => void;
   onNavigationStateChange: () => void;
   navigationRef: React.MutableRefObject<NavigationContainerRef>;
}

export interface UseForegroundPushOptions {
   disableRedirectWhen?: RouteHistoryRule[];
}

export interface RouteHistoryRule {
   previousRoute?: string;
   currentRoute?: string;
}
