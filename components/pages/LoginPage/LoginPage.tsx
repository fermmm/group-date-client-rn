import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { withTheme, Button } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/ts-tools/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { LogoSvg } from "../../../assets/LogoSvg";
import { NavigationContainerProps, NavigationScreenProp } from "react-navigation";

export interface LoginProps extends Themed, NavigationContainerProps { }
export interface LoginState { }

class LoginPage extends Component<LoginProps, LoginState> {
    static defaultProps: Partial<LoginProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

        return (
            <LinearGradient
                colors={[colors.background, colors.background2]}
                style={styles.mainContainer}
                start={[0, 0.5]}
                end={[0, 1.3]}
            >
                <View style={styles.mainContainer}>
                    <LogoSvg style={styles.logo} color={colors.accent2} />
                    <Text style={[styles.textBlock, { color: colors.text2 }]}>
                        ¡Bienvenide!. Poly Dates es una app que organiza citas grupales para poliamoroses que se gusten.
                    </Text>
                    <Text style={[styles.textBlock, { color: colors.text2 }]}>
                        Aplicación sin fines de lucro y de código abierto.
                    </Text>
                    <Button mode="outlined" uppercase={false} color={colors.text} style={styles.button} contentStyle={styles.buttonContent} onPress={() => navigate("Main")}>
                        Comenzar
                    </Button>
                </View>
            </LinearGradient>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 18,
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
        borderRadius: 25,
    },
    buttonContent: {
        width: "100%",
        height: 45,
    },
});

export default withTheme(LoginPage);
