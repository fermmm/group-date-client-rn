import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api/tools/reactQueryTools";
import MainPage from "./components/pages/MainPage/MainPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import GroupPage from "./components/pages/GroupPage/GroupPage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import RegistrationFormsPage from "./components/pages/RegistrationFormsPage/RegistrationFormsPage";
import React, { Component } from "react";
import { AppLoading } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { loadFontMontserrat } from "./common-tools/font-loaders/loadFontMontserrat";
import { currentTheme } from "./config";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DateVotingPage from "./components/pages/DateVotingPage/DateVotingPage";
import ChatPage from "./components/pages/ChatPage/ChatPage";
import AboutPage from "./components/pages/AboutPage/AboutPage";
import { en } from "./texts/en/en";
import { es } from "./texts/es/es";

i18n.fallbacks = true;
i18n.translations = {
   en,
   es
};
i18n.defaultLocale = "en";
i18n.locale = Localization.locale.split("-")[0];
// i18n.locale = "en";    // Uncomment to try another language

interface PageBasicWrapperState {
   resourcesLoaded: boolean;
}

const TestTheme = {
   dark: false,
   colors: {
      primary: "rgb(255, 45, 85)",
      background: "rgb(0, 0, 0)",
      card: "rgb(0, 0, 0)",
      text: "rgb(28, 28, 30)",
      border: "rgb(199, 199, 204)",
      notification: "rgb(255, 69, 58)"
   }
};

const Stack = createStackNavigator();

export default class App extends Component<{}, PageBasicWrapperState> {
   state: PageBasicWrapperState = {
      resourcesLoaded: false
   };

   async componentDidMount(): Promise<void> {
      await loadFontMontserrat();
      this.setState({ resourcesLoaded: true });
   }

   render(): JSX.Element {
      if (!this.state.resourcesLoaded) {
         return <AppLoading />;
      }

      return (
         <QueryClientProvider client={queryClient}>
            <PaperProvider theme={(currentTheme as unknown) as ReactNativePaper.Theme}>
               <NavigationContainer theme={TestTheme}>
                  <Stack.Navigator initialRouteName="Login" headerMode={"none"}>
                     <Stack.Screen name="Login" component={LoginPage} />
                     <Stack.Screen name="RegistrationForms" component={RegistrationFormsPage} />
                     <Stack.Screen name="Main" component={MainPage} />
                     <Stack.Screen name="Profile" component={ProfilePage} />
                     <Stack.Screen name="About" component={AboutPage} />
                     <Stack.Screen name="Group" component={GroupPage} />
                     <Stack.Screen name="Chat" component={ChatPage} />
                     <Stack.Screen name="DateVoting" component={DateVotingPage} />
                  </Stack.Navigator>
               </NavigationContainer>
            </PaperProvider>
         </QueryClientProvider>
      );
   }
}
