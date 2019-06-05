import React, { Component } from "react";
import NavigationBar from "../../common/NavigationBar/NavigationBar";
import { View, StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export default class Main extends Component {
    render(): JSX.Element {
        return (
            <NavigationBar
                sections={{
                    cards: () => <View style={[styles.scene, { backgroundColor: "white" }]} />,
                    groups: () => <View style={[styles.scene, { backgroundColor: "#FFC681" }]} />,
                    settings: () => <View style={[styles.scene, { backgroundColor: "white" }]} />,
                }}
                routes={[
                    { key: "cards", icon: "cards" },
                    { key: "groups", icon: "infinity" },
                    { key: "settings", icon: "account-settings" },
                ]}
            />
        )
    }
}

const styles: Styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});
