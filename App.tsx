import React, { Component } from "react";
import { AppLoading } from "expo";
import {
    Provider as PaperProvider,
    DarkTheme,
    DefaultTheme,
} from "react-native-paper";
import { StatusBar } from "react-native";
import Main from "./components/pages/Main/Main";

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
            <PaperProvider theme={DefaultTheme /*DarkTheme*/}>
                <Main />
            </PaperProvider>
        );
    }
}
