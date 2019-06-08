import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme } from "react-native-paper";
import { IThemed } from "../../../../common-tools/ts-tools/Themed";
import { Theme } from "react-native-paper/typings";

export interface IGroupsPageProps extends IThemed {}
export interface IGroupsPageState {}

class GroupsPage extends Component<IGroupsPageProps, IGroupsPageState> {
    
    render(): JSX.Element {
        const { colors }: Theme = this.props.theme;

        return (
            <>
                <View style={[styles.scene, { backgroundColor: colors.background }]} />
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});

export default withTheme(GroupsPage);
