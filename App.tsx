import * as Localization from "expo-localization";
import i18n from "i18n-js";
import React, { FC, useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
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
import WelcomeTourPage from "./components/pages/WelcomeTourPage/WelcomeTourPage";
import ContactPage from "./components/pages/ContactPage/ContactPage";
import { setupNotificationPressListener } from "./common-tools/device-native-api/notifications/setupNotificationPressListener";
import { CacheConfigProvider } from "./api/tools/useCache/useCache";
import { welcomeWasShowed } from "./components/pages/WelcomeTourPage/tools/useWelcomeShowed";
import { en } from "./texts/en/en";
import { es } from "./texts/es/es";
import "intl";
import "intl/locale-data/jsonp/en";
import "intl/locale-data/jsonp/es";
import "dayjs/locale/en";
import "dayjs/locale/es";
import RemoveSeenWizardPage from "./components/pages/RemoveSeenWizardPage/RemoveSeenWizardPage";
import GlobalModalsProvider from "./components/common/GlobalModalsProvider/GlobalModalsProvider";
import KeyboardAvoidingViewExtended from "./components/common/KeyboardAvoidingViewExtended/KeyboardAvoidingViewExtended";
import { loadFontPolly } from "./common-tools/font-loaders/loadFontPolly";

i18n.fallbacks = true;
i18n.translations = {
   en,
   es
};
i18n.defaultLocale = "en";
i18n.locale = Localization.locale.split("-")[0];
// i18n.locale = "en";    // Uncomment to force setting a language for debugging

const Stack = createStackNavigator();

setupNotificationPressListener();

const App: FC = () => {
   const [resourcesLoaded, setResourcesLoaded] = useState(false);
   const [welcomeShowed, setWelcomeShowed] = useState(false);

   useEffect(() => {
      (async () => {
         // await loadFontMontserrat();
         await loadFontPolly();
         setWelcomeShowed(await welcomeWasShowed());
         setResourcesLoaded(true);
      })();
   }, []);

   if (!resourcesLoaded) {
      return <AppLoading />;
   }

   return (
      <KeyboardAvoidingViewExtended disableOnAndroid>
         <CacheConfigProvider>
            <PaperProvider theme={currentTheme as unknown as ReactNativePaper.Theme}>
               <GlobalModalsProvider>
                  <StatusBar style="light" translucent backgroundColor={"transparent"} />
                  <NavigationContainerWithNotifications>
                     <Stack.Navigator
                        initialRouteName={welcomeShowed ? "Login" : "WelcomeTour"}
                        headerMode={"none"}
                     >
                        <Stack.Screen name="WelcomeTour" component={WelcomeTourPage} />
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
                        <Stack.Screen name="ContactPage" component={ContactPage} />
                        <Stack.Screen
                           name="RemoveSeenWizardPage"
                           component={RemoveSeenWizardPage}
                        />
                     </Stack.Navigator>
                  </NavigationContainerWithNotifications>
               </GlobalModalsProvider>
            </PaperProvider>
         </CacheConfigProvider>
      </KeyboardAvoidingViewExtended>
   );
};

export default App;
