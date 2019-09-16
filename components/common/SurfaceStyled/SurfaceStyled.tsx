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
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 20,
        elevation: 6,
    },
});

export default SurfaceStyled;
