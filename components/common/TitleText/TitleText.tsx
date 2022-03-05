import React, { Component, FC } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface TitleTextProps {
   extraSize?: boolean;
   extraMarginLeft?: boolean;
   style?: StyleProp<TextStyle>;
   adjustsFontSizeToFit?: boolean;
}

const TitleText: FC<TitleTextProps> = props => {
   return (
      <Text
         {...props}
         style={[
            styles.titleStyle,
            props.extraMarginLeft && { marginLeft: 10 },
            props.extraSize && { fontSize: 23 },
            props.style
         ]}
      >
         {props.children}
      </Text>
   );
};

const styles: Styles = StyleSheet.create({
   titleStyle: {
      fontFamily: currentTheme.font.light,
      fontSize: 21,
      marginBottom: 10,
      marginRight: 10
   }
});

export default TitleText;
