import React, { Component } from "react";
import { AppLoading } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import MainPage from "./components/pages/MainPage/MainPage";
import LightTheme from "./common-tools/themes/LightTheme";
import DarkTheme from "./common-tools/themes/DarkTheme";

interface IAppState {
    resourcesLoaded: boolean;
}

export default class App extends Component<void, IAppState> {
    state: IAppState = {
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
                <MainPage />
            </PaperProvider>
        );
    }
}
