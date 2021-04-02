import * as Localization from "expo-localization";
import i18n from "i18n-js";
import React, { useEffect, useState } from "react";
import { AppLoading } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { loadFontMontserrat } from "./common-tools/font-loaders/loadFontMontserrat";
import { currentTheme } from "./config";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainerWithNotifications } from "./components/common/NavigationContainerWithNotifications/NavigationContainerWithNotifications";
import MainPage from "./components/pages/MainPage/MainPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import GroupPage from "./components/pages/GroupPage/GroupPage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import RegistrationFormsPage from "./components/pages/RegistrationFormsPage/RegistrationFormsPage";
import DateVotingPage from "./components/pages/DateVotingPage/DateVotingPage";
import ChatPage from "./components/pages/ChatPage/ChatPage";
import AboutPage from "./components/pages/AboutPage/AboutPage";
import AdminPage from "./components/pages/AdminPage/AdminPage";
import CreateTagPage from "./components/pages/CreateTagPage/CreateTagPage";
import { listenForPushNotifications } from "./common-tools/device-native-api/notifications/listenForPushNotifications";
import { CacheConfigProvider } from "./api/tools/useCache/useCache";
import { en } from "./texts/en/en";
import { es } from "./texts/es/es";
import "intl";
import "intl/locale-data/jsonp/en";
import "intl/locale-data/jsonp/es";
import "dayjs/locale/en";
import "dayjs/locale/es";

i18n.fallbacks = true;
i18n.translations = {
   en,
   es
};
i18n.defaultLocale = "en";
i18n.locale = Localization.locale.split("-")[0];
// i18n.locale = "en";    // Uncomment to force setting a language for debugging

const testTheme = {
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

listenForPushNotifications();

const App = () => {
   const [resourcesLoaded, setResourcesLoaded] = useState(false);

   useEffect(() => {
      (async () => {
         await loadFontMontserrat();
         setResourcesLoaded(true);
      })();
   }, []);

   if (!resourcesLoaded) {
      return <AppLoading />;
   }

   return (
      <CacheConfigProvider>
         <PaperProvider theme={(currentTheme as unknown) as ReactNativePaper.Theme}>
            <NavigationContainerWithNotifications theme={testTheme}>
               <Stack.Navigator initialRouteName="Login" headerMode={"none"}>
                  <Stack.Screen name="Login" component={LoginPage} />
                  <Stack.Screen name="RegistrationForms" component={RegistrationFormsPage} />
                  <Stack.Screen name="Main" component={MainPage} />
                  <Stack.Screen name="Profile" component={ProfilePage} />
                  <Stack.Screen name="About" component={AboutPage} />
                  <Stack.Screen name="Group" component={GroupPage} />
                  <Stack.Screen name="Chat" component={ChatPage} />
                  <Stack.Screen name="DateVoting" component={DateVotingPage} />
                  <Stack.Screen name="Admin" component={AdminPage} />
                  <Stack.Screen name="CreateTag" component={CreateTagPage} />
               </Stack.Navigator>
            </NavigationContainerWithNotifications>
         </PaperProvider>
      </CacheConfigProvider>
   );
};

export default App;
