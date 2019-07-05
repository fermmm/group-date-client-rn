import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/ts-tools/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo";
import { LogoSvg } from "../../../assets/LogoSvg";

export interface IProps extends Themed { }
export interface IState { }

class LoginPage extends Component<IProps, IState> {
    static defaultProps: Partial<IProps> = {

    };

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            <LinearGradient
                colors={[colors.background, colors.background2]}
                style={styles.mainContainer}
                start={[0, 0]}
                end={[0, 1]}
            >
                <LogoSvg color={colors.accent2}/>
            </LinearGradient>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default withTheme(LoginPage);
