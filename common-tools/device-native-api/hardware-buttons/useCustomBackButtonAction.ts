import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { BackHandler } from "react-native";

/**
 * A custom function for the hardware back button that will be applied on the current page.
 * The function provided is wrapped in useCallback so it's required to pass deps for useCallback.
 * Returns the same function passed as argument wrapped in useCallback.
 *
 * @param fn A function that when returns falsy the default back button behavior is also executed, otherwise not.
 * @param deps The dependency list to pass as the second argument of useCallback.
 */
export function useCustomBackButtonAction(fn: () => boolean, deps: React.DependencyList) {
   const fnWithUseCallback = useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", fn);
      return () => {
         BackHandler.removeEventListener("hardwareBackPress", fn);
      };
   }, deps);

   useFocusEffect(fnWithUseCallback);

   return fnWithUseCallback;
}
