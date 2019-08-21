import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Appbar } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withNavigation, NavigationInjectedProps, NavigationScreenProp } from "react-navigation";

export interface AppBarHeaderProps extends Themed, NavigationInjectedProps { }
export interface AppBarHeaderState { }

class AppBarHeader extends Component<AppBarHeaderProps, AppBarHeaderState> {
    static defaultProps: Partial<AppBarHeaderProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        const { goBack }: NavigationScreenProp<{}> = this.props.navigation;

        return (
            <Appbar.Header>
                <Appbar.BackAction
                    onPress={() => goBack()}
                />
                <Appbar.Content
                    title="Title"
                    subtitle="Subtitle"
                />
                <Appbar.Action icon="more-vert" />
            </Appbar.Header>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default withTheme(withNavigation(AppBarHeader));
