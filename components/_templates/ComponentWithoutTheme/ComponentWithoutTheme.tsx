import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface Props {}
export interface State {}

class ComponentWithoutTheme extends Component<Props, State> {
    render(): JSX.Element {
        return (
            <>
              {this.props.children}
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default ComponentWithoutTheme;
