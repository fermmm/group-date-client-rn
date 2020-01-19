import MainPage from "./components/pages/MainPage/MainPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import GroupPage from "./components/pages/GroupPage/GroupPage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import QuestionsPage from "./components/pages/QuestionsPage/QuestionsPage";
import RegistrationFormsPage from "./components/pages/RegistrationFormsPage/RegistrationFormsPage";
import React, { Component } from "react";
import { AppLoading } from "expo";
import * as Facebook from "expo-facebook";
import { Provider as PaperProvider } from "react-native-paper";
import { loadFontMontserrat } from "./common-tools/fontLoaders/loadFontMontserrat";
import { currentTheme } from "./config";
import { NavigationContainer, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DateVotingPage from "./components/pages/DateVotingPage/DateVotingPage";
import ChangePicturesPage from "./components/pages/SettingsPage/ChangePicturesPage/ChangePicturesPage";
import ChangeProfileTextPage from "./components/pages/SettingsPage/ChangeProfileTextPage/ChangeProfileTextPage";
import ChangeBasicInfoPage from "./components/pages/SettingsPage/ChangeBasicInfoPage/ChangeBasicInfoPage";
import ChangeDateIdeaPage from "./components/pages/SettingsPage/ChangeDateIdeaPage/ChangeDateIdeaPage";
import ChangeQuestionsPage from "./components/pages/SettingsPage/ChangeQuestionsPage/ChangeQuestionsPage";
import ChatPage from "./components/pages/ChatPage/ChatPage";
import AboutPage from "./components/pages/AboutPage/AboutPage";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { esAr } from "./texts/esAr/esAr";
import { en } from "./texts/en/en";
import { es } from "./texts/es/es";

const Navigator: NavigationContainer = createAppContainer(
   createStackNavigator(
      {
         Login: { screen: LoginPage },
         Main: { screen: MainPage },
         Group: { screen: GroupPage },
         Chat: { screen: ChatPage },
         DateVoting: { screen: DateVotingPage },
         Profile: { screen: ProfilePage },
         Questions: { screen: QuestionsPage },
         RegistrationForms: { screen: RegistrationFormsPage },
         About: { screen: AboutPage },
         ChangePictures: { screen: ChangePicturesPage },
         ChangeProfileText: { screen: ChangeProfileTextPage },
         ChangeBasicInfo: { screen: ChangeBasicInfoPage },
         ChangeDateIdea: { screen: ChangeDateIdeaPage },
         ChangeQuestions: { screen: ChangeQuestionsPage },
      },
      {
         initialRouteName: "Login",
         headerMode: "none",
      },
   )
);

i18n.fallbacks = true;
i18n.translations = {
   en, 
   es,
   "es-AR" : esAr, 
};
i18n.defaultLocale = "es";
i18n.locale = Localization.locale;
// i18n.locale = "en";    // Uncomment to try another language

interface PageBasicWrapperState {
   resourcesLoaded: boolean;
}

export default class App extends Component<{}, PageBasicWrapperState> {
   state: PageBasicWrapperState = {
      resourcesLoaded: false,
   };

   async componentDidMount(): Promise<void> {
      await loadFontMontserrat();
      // await Facebook.logInWithReadPermissionsAsync();
      this.setState({ resourcesLoaded: true });
   }

   render(): JSX.Element {
      if (!this.state.resourcesLoaded) {
         return <AppLoading />;
      }

      return (
         <PaperProvider theme={currentTheme}>
            <Navigator />
         </PaperProvider>
      );
   }
}
