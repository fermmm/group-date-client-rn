import * as Localization from "expo-localization";
import i18n from "i18n-js";
import MainPage from "./components/pages/MainPage/MainPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import GroupPage from "./components/pages/GroupPage/GroupPage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import QuestionsPage from "./components/pages/QuestionsPage/QuestionsPage";
import RegistrationFormsPage from "./components/pages/RegistrationFormsPage/RegistrationFormsPage";
import React, { Component } from "react";
import { AppLoading } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { loadFontMontserrat } from "./common-tools/fontLoaders/loadFontMontserrat";
import { currentTheme } from "./config";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DateVotingPage from "./components/pages/DateVotingPage/DateVotingPage";
import ChangePicturesPage from "./components/pages/SettingsPage/ChangePicturesPage/ChangePicturesPage";
import ChangeProfileTextPage from "./components/pages/SettingsPage/ChangeProfileTextPage/ChangeProfileTextPage";
import ChangeBasicInfoPage from "./components/pages/SettingsPage/ChangeBasicInfoPage/ChangeBasicInfoPage";
import ChangeDateIdeaPage from "./components/pages/SettingsPage/ChangeDateIdeaPage/ChangeDateIdeaPage";
import ChangeQuestionsPage from "./components/pages/SettingsPage/ChangeQuestionsPage/ChangeQuestionsPage";
import ChatPage from "./components/pages/ChatPage/ChatPage";
import AboutPage from "./components/pages/AboutPage/AboutPage";
import { en } from "./texts/en/en";
import { es } from "./texts/es/es";

const Stack = createStackNavigator();

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
         <PaperProvider theme={(currentTheme as unknown) as ReactNativePaper.Theme}>
            <NavigationContainer theme={TestTheme}>
               <Stack.Navigator initialRouteName="Login" headerMode={"none"}>
                  <Stack.Screen name="Login" component={LoginPage} />
                  <Stack.Screen name="Main" component={MainPage} />
                  <Stack.Screen name="Group" component={GroupPage} />
                  <Stack.Screen name="Chat" component={ChatPage} />
                  <Stack.Screen name="DateVoting" component={DateVotingPage} />
                  <Stack.Screen name="Profile" component={ProfilePage} />
                  <Stack.Screen name="Questions" component={QuestionsPage} />
                  <Stack.Screen name="About" component={AboutPage} />
                  <Stack.Screen name="RegistrationForms" component={RegistrationFormsPage} />
                  <Stack.Screen name="ChangePictures" component={ChangePicturesPage} />
                  <Stack.Screen name="ChangeProfileText" component={ChangeProfileTextPage} />
                  <Stack.Screen name="ChangeBasicInfo" component={ChangeBasicInfoPage} />
                  <Stack.Screen name="ChangeDateIdea" component={ChangeDateIdeaPage} />
                  <Stack.Screen name="ChangeQuestions" component={ChangeQuestionsPage} />
               </Stack.Navigator>
            </NavigationContainer>
         </PaperProvider>
      );
   }
}
