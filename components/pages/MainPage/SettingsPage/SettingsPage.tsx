import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme, Button } from "react-native-paper";
import { ThemeExt, Themed } from "../../../../common-tools/themes/types/Themed";

export interface SettingsPageProps extends Themed {}
export interface SettingsPageState {}

class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {
    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            <>
                <View style={[styles.scene, { backgroundColor: colors.backgroundForText }]} >
                    <Button icon="add-a-photo" mode="contained" onPress={() => console.log('Pressed')}>
                        Press me
                    </Button>
                </View>
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});

export default withTheme(SettingsPage);
