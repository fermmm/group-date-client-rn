import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { IThemed, ITheme } from "../../../../common-tools/ts-tools/Themed";
import { withTheme, FAB } from "react-native-paper";

export interface ILikeDislikeProps extends IThemed { 
    onLikeClick: () => void;
    onDislikeClick: () => void;
}

class LikeDislikeButtons extends Component<ILikeDislikeProps> {

    render(): JSX.Element {
        const { colors }: ITheme = this.props.theme;

        return (
            <View style={styles.container}>
                <View style={styles.button} >
                    <FAB
                        style={[{backgroundColor: colors.background2}, styles.fab]}
                        icon="close"
                        onPress={() => this.props.onDislikeClick()}
                    />
                </View>
                <View style={styles.button} >
                    <FAB
                        style={[{backgroundColor: colors.surface}, styles.fab]}
                        icon="star"
                        onPress={() => this.props.onLikeClick()}
                    />
                </View>
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    container: {
        width: 170, 
        height: 40, 
        flexDirection: "row", 
        position: "absolute", 
        bottom: 0,
        justifyContent: "space-around",
        alignSelf: "center",
    },
    button: {
        width: 56,
    },
    fab: {
        bottom: "50%",
    },
});

export default withTheme(LikeDislikeButtons);