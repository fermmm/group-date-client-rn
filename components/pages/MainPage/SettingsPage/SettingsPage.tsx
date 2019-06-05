import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";

export interface ISettingsPageProps {

}

export interface ISettingsPageState {
    
}

export default class SettingsPage extends Component<ISettingsPageProps, ISettingsPageState> {
    render(): JSX.Element {
        return (
            <>
                <View style={[styles.scene, { backgroundColor: "white" }]} />
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    example: {
        flex: 1,
    },
});