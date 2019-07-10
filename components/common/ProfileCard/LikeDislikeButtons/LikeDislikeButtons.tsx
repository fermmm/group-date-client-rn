import React, { Component } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { Themed, ThemeExt } from "../../../../common-tools/ts-tools/Themed";
import { withTheme, FAB } from "react-native-paper";
import color from "color";
import { LogoSvg } from "../../../../assets/LogoSvg";

export interface LikeDislikeProps extends Themed {
    style?: StyleProp<ViewStyle>;
    onLikeClick: () => void;
    onDislikeClick: () => void;
}

class LikeDislikeButtons extends Component<LikeDislikeProps> {

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.button} >
                    <FAB
                        style={{ backgroundColor: color(colors.surface).darken(0.1).desaturate(0.2).string() }}
                        color={color(colors.accent).darken(0.15).string()}
                        icon="close"
                        onPress={() => this.props.onDislikeClick()}
                    />
                </View>
                <View style={styles.button} >
                    <FAB
                        style={{ backgroundColor: color(colors.primary).darken(0.1).desaturate(0.1).string() }}
                        color={color(colors.accent).darken(0.04).string()}
                        icon={
                            ({ color: c }) => <LogoSvg color={c} style={styles.logo} />
                        }
                        onPress={() => this.props.onLikeClick()}
                    />
                </View>
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    container: {
        width: 130,                         // This controls how close together the buttons are placed.
        height: "auto",
        flexDirection: "row",
        position: "absolute",
        justifyContent: "space-around",
    },
    button: {
        width: "auto",
    },
});

export default withTheme(LikeDislikeButtons);
