import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";

export interface Props extends Themed {}
export interface State {}

class SimpleComponent extends Component<Props, State> {
    static defaultProps: Partial<Props> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        
        return (
            <>
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default withTheme(SimpleComponent);
