import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Surface, SurfaceProps } from "react-native-paper";

class SurfaceStyled extends Component<SurfaceProps> {
    static defaultProps: Partial<SurfaceProps> = {};

    render(): JSX.Element {
        return (
            <Surface style={[styles.surface, this.props.style]}>
                {this.props.children}
            </Surface>
        );
    }
}

const styles: Styles = StyleSheet.create({
    surface: {
        marginBottom: 10,
        padding: 12,
        elevation: 9,
        borderRadius: 10,
        shadowRadius: 100,
    },
});

export default SurfaceStyled;
