import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Text, TypographyProps } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

class TitleSmallText extends Component<TypographyProps> {
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
      fontFamily: currentTheme.font.regular,
      fontSize: 12,
      paddingLeft: 10,
      paddingRight: 10
   }
});

export default TitleSmallText;
