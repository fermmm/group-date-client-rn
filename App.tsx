import MainPage from "./components/pages/MainPage/MainPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import { createStackNavigator, createAppContainer, NavigationContainer } from "react-navigation";
import React, { Component } from "react";
import { AppLoading } from "expo";
import { Provider as PaperProvider, Text } from "react-native-paper";
import LightTheme from "./common-tools/themes/LightTheme";
import DarkTheme from "./common-tools/themes/DarkTheme";

const Navigator: NavigationContainer = createAppContainer(
    createStackNavigator(
    {
        Login: { screen: LoginPage },
        Main: { screen: MainPage },
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
        resourcesLoaded: true,
    };

    /*async componentDidMount(): Promise<void> {
        await loadFonts();
        this.setState({ resourcesLoaded: true });
    }*/
    
    componentDidMount(): void {
        
    }

    render(): JSX.Element {
        if (!this.state.resourcesLoaded) {
            return <AppLoading />;
        }

        return (
            <PaperProvider theme={LightTheme /*DarkTheme*/}>                
                <Navigator />
            </PaperProvider>
        );
    }
}
