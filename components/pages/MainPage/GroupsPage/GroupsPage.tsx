import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/ts-tools/Themed";

export interface GroupsPageProps extends Themed {}
export interface GroupsPageState {}

class GroupsPage extends Component<GroupsPageProps, GroupsPageState> {
    
    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

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
