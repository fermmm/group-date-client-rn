import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Text, TypographyProps } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

class TitleText extends Component<TypographyProps> {
    render(): JSX.Element {
        return (
            <Text {...this.props} style={[styles.titleStyle, this.props.style]}>
              {this.props.children}
            </Text>
        );
    }
}

const styles: Styles = StyleSheet.create({
    titleStyle: {
        fontFamily: currentTheme.fonts.light,
        fontSize: 20,
        marginBottom: 12,
        paddingLeft: 4,
    },
});

export default TitleText;
