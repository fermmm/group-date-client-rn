import MainPage from "./components/pages/MainPage/MainPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import GroupPage from "./components/pages/GroupPage/GroupPage";
import VotingPage from "./components/pages/VotingPage/VotingPage";
import React, { Component } from "react";
import { AppLoading } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { loadFontMontserrat } from "./common-tools/fontLoaders/loadFontMontserrat";
import { currentTheme } from "./config";
import { NavigationContainer, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const Navigator: NavigationContainer = createAppContainer(
    createStackNavigator(
    {
        Login: { screen: LoginPage },
        Main: { screen: MainPage },
        Group: { screen: GroupPage },
        Voting: { screen: VotingPage },
    }, 
    { 
        headerMode: "none",
    },
));

interface PageBasicWrapperState {
    resourcesLoaded: boolean;
}

export default class App extends Component<{}, PageBasicWrapperState> {
    state: PageBasicWrapperState = {
        resourcesLoaded: false,
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
            <PaperProvider theme={currentTheme}>                
                <Navigator />
            </PaperProvider>
        );
    }
}
