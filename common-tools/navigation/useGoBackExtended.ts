import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";
import { useNavigation } from "./useNavigation";

/**
 * When the hooks parameters are present handles the back action (device back button or navigation.goBack())
 * returns a goBack() function in case it's needed by another custom goBack code.
 * Currently it doesn't support updating parameters, only the parameters from the first execution will be used.
 */
export function useGoBackExtended<T = object>(
   options?: UseGoBackExtendedOptions<T>
): UseGoBackExtended {
   const { canGoBack, navigateWithoutHistory, goBack: nativeGoBack } = useNavigation();

   const handleBackButton = useCallback((): boolean => {
      if (options?.replaceBackRoute?.goToRoute != null) {
         navigateWithoutHistory(
            options.replaceBackRoute.goToRoute,
            options.replaceBackRoute.params
         );

         return true;
      }

      if (!canGoBack() && options?.whenBackNotAvailable?.goToRoute != null) {
         navigateWithoutHistory(
            options.whenBackNotAvailable.goToRoute,
            options.whenBackNotAvailable.params
         );
         return true;
      }

      if (options?.onBackPress) {
         options?.onBackPress();
         return true;
      }

      // Returning true disables the default behavior of the back button:
      return false;
   }, []);

   const goBack = useCallback(() => {
      if (!handleBackButton()) {
         nativeGoBack();
      }
   }, []);

   useFocusEffect(
      useCallback(() => {
         BackHandler.addEventListener("hardwareBackPress", handleBackButton);
         return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
         };
      }, [handleBackButton])
   );

   return { goBack };
}

export interface UseGoBackExtended {
   goBack: () => void;
}

export interface UseGoBackExtendedOptions<T> {
   /**
    * Route to go instead of the default one when the system back is executed.
    */
   replaceBackRoute?: RouteRedirection<T>;
   /**
    * Custom function to execute instead system back action.
    */
   onBackPress?: () => void;
   /**
    * Route to go when system back action is executed but this one only is executed when the system default action has nowhere to go.
    */
   whenBackNotAvailable?: RouteRedirection<T>;
}

export interface RouteRedirection<T> {
   goToRoute: string;
   params?: T;
}
