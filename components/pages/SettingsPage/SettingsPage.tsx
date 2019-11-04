import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, Button } from "react-native-paper";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";

export interface SettingsPageProps extends Themed {}
export interface SettingsPageState {}

class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {
    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

        return (
            <>
                <BasicScreenContainer>  
                    <Button icon="settings" mode="contained" onPress={() => console.log("Pressed")}>
                        Settings
                    </Button>
                </BasicScreenContainer>
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
