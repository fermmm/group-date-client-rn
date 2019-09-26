import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Appbar } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withNavigation, NavigationInjectedProps, NavigationScreenProp } from "react-navigation";

export interface AppBarHeaderProps extends Themed, NavigationInjectedProps {
    title?: string;
    subtitle?: string;
    showMenuIcon?: boolean;
}
export interface AppBarHeaderState {}

class AppBarHeader extends Component<AppBarHeaderProps, AppBarHeaderState> {
    static defaultProps: Partial<AppBarHeaderProps> = {
        title: "",
        subtitle: "",
        showMenuIcon: false,
    };

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
        const { goBack }: NavigationScreenProp<{}> = this.props.navigation;

        return (
            <Appbar.Header style={{backgroundColor: colors.primary}} dark={true}>
                <Appbar.BackAction
                    onPress={() => goBack()}
                />
                <Appbar.Content
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                />
                {
                    this.props.showMenuIcon &&
                        <Appbar.Action icon="more-vert" />
                }
            </Appbar.Header>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default withNavigation(withTheme(AppBarHeader));
