import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";

export interface IGroupsPageProps {

}

export interface IGroupsPageState {

}

export default class GroupsPage extends Component<IGroupsPageProps, IGroupsPageState> {
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
