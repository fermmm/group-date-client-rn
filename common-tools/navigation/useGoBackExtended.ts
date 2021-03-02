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
      if (options?.replaceBackAction?.goToRoute != null) {
         navigateWithoutHistory(
            options.replaceBackAction.goToRoute,
            options.replaceBackAction.params
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
   replaceBackAction?: RouteRedirection<T>;
   whenBackNotAvailable?: RouteRedirection<T>;
}

export interface RouteRedirection<T> {
   goToRoute: string;
   params?: T;
}
