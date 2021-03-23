import {
   StackActions,
   useNavigation as useNavigationNative,
   useRoute
} from "@react-navigation/native";

export interface useNavigation {
   currentRouteName: string;
   isFocused: boolean;
   navigate: <T extends object>(name: string, params?: T) => void;
   navigateWithoutHistory: <T extends object>(name: string, params?: T) => void;
   goBack: () => void;
   canGoBack: () => boolean;
}

export function useNavigation() {
   const navigation = useNavigationNative();
   const route = useRoute();

   const navigate = <T>(name: string, params?: T) => {
      navigation.dispatch(StackActions.push(name, (params as unknown) as object));
   };

   const navigateWithoutHistory = <T>(name: string, params?: T) => {
      navigation.dispatch(StackActions.replace(name, (params as unknown) as object));
   };

   return {
      currentRouteName: route.name,
      isFocused: navigation.isFocused,
      navigate,
      navigateWithoutHistory,
      goBack: navigation.goBack,
      canGoBack: navigation.canGoBack
   };
}
