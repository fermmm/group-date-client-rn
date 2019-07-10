import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { withTheme, Button } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/ts-tools/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo";
import { LogoSvg } from "../../../assets/LogoSvg";

export interface LoginProps extends Themed { }
export interface LoginState { }

class LoginPage extends Component<LoginProps, LoginState> {
    static defaultProps: Partial<LoginProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            <LinearGradient
                colors={[colors.background, colors.background2]}
                style={styles.mainContainer}
                start={[0, 0.5]}
                end={[0, 1]}
            >
                <LogoSvg color={colors.accent2} style={styles.logo}/>
                <Text style={[styles.textBlock, {color: colors.text2}]}>
                    ¡Bienvenide!, Poly Dates es una app que genera citas grupales para poliamoroses que se gusten.
                </Text>
                <Text style={[styles.textBlock, {color: colors.text2}]}>
                    Proyecto sin fines de lucro y de código abierto.
                </Text>
                <Button mode="outlined" color={colors.text2} style={styles.button} onPress={() => console.log('Comenzar pressed')}>
                    Comenzar
                </Button>
            </LinearGradient>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        alignContent: "flex-end",
        justifyContent: "flex-end",
        padding: 25,
    },
    logo: {
        position: "absolute",
        top: "15%",
        width: "35%",
    },
    textBlock: {
        marginBottom: 15,
        textAlign: "center",
    },
    button: {
        width: "100%",
        marginTop: 50,
        marginBottom: 15,
    },
});

export default withTheme(LoginPage);
