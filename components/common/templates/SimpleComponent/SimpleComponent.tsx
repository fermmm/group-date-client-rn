import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme } from "react-native-paper";
import { IThemed, ITheme } from "../../../../common-tools/ts-tools/Themed";

export interface IProps extends IThemed {}
export interface IState {}

class SimpleComponent extends Component<IProps, IState> {
    render(): JSX.Element {
        const { colors }: ITheme = this.props.theme;
        
        return (
            <>
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    example: {
        flex: 1,
    },
});

export default withTheme(SimpleComponent);
