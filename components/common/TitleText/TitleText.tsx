import React, { Component } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface TitleTextProps {
   extraSize?: boolean;
   extraMarginLeft?: boolean;
   style?: StyleProp<TextStyle>;
}

class TitleText extends Component<TitleTextProps> {
   render(): JSX.Element {
      return (
         <Text
            {...this.props}
            style={[
               styles.titleStyle,
               this.props.extraMarginLeft && { marginLeft: 10 },
               this.props.extraSize && { fontSize: 20 },
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
   }
});

export default TitleText;
