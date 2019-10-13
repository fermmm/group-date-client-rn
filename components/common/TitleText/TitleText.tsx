import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Text, TypographyProps } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface TitleTextProps extends TypographyProps {
   extraSize?: boolean;
   extraMarginLeft?: boolean;
}

class TitleText extends Component<TitleTextProps> {
    render(): JSX.Element {
        return (
            <Text 
               {...this.props} 
               style={[
                  styles.titleStyle, 
                  this.props.extraMarginLeft && {marginLeft: 10}, 
                  this.props.extraSize && {fontSize: 20}, 
                  this.props.style
               ]}
            >
              {this.props.children}
            </Text>
        );
    }
}

const styles: Styles = StyleSheet.create({
    titleStyle: {
        fontFamily: currentTheme.fonts.light,
        fontSize: 17,
        marginBottom: 10,
        marginRight: 10
    },
});

export default TitleText;
