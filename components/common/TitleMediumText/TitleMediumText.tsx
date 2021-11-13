import React, { Component, ComponentProps, ComponentPropsWithRef, FC } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

const TitleMediumText: FC<ComponentProps<typeof Text>> = props => {
   return (
      <Text {...props} style={[styles.titleStyle, props.style]}>
         {props.children}
      </Text>
   );
};

const styles: Styles = StyleSheet.create({
   titleStyle: {
      fontFamily: currentTheme.font.regular,
      fontSize: 14,
      marginBottom: 25,
      paddingLeft: 4
   }
});

export default TitleMediumText;
