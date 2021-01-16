import { StackActions, useNavigation as useNavigationNative } from "@react-navigation/native";

export interface useNavigation {
   isFocused: boolean;
   navigate: <T extends object>(name: string, params?: T) => void;
   navigateWithoutHistory: <T extends object>(name: string, params?: T) => void;
   goBack: () => void;
   canGoBack: () => boolean;
}

export function useNavigation() {
   const navigation = useNavigationNative();

   const navigate = <T>(name: string, params?: T) => {
      navigation.dispatch(StackActions.push(name, (params as unknown) as object));
   };

   const navigateWithoutHistory = <T>(name: string, params?: T) => {
      navigation.dispatch(StackActions.replace(name, (params as unknown) as object));
   };

   return {
      isFocused: navigation.isFocused,
      navigate,
      navigateWithoutHistory,
      goBack: navigation.goBack,
      canGoBack: navigation.canGoBack
   };
}
