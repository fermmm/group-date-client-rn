import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface EmptyPageMessageProps extends Themed {
   text?: string;
}

class EmptyPageMessage extends Component<EmptyPageMessageProps> {
   static defaultProps: Partial<EmptyPageMessageProps> = {};

   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;

      return (
         <LinearGradient
            style={{ flex: 1 }}
            locations={[0.7, 1]}
            colors={[
               color(currentTheme.colors.background).string(),
               color(currentTheme.colors.backgroundBottomGradient).alpha(1).string()
            ]}
         >
            <View style={styles.mainContainer}>
               {this.props.text && <Text style={styles.text}>{this.props.text}</Text>}
               {this.props.children}
            </View>
         </LinearGradient>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginBottom: 150
   },
   text: {
      fontSize: 17,
      fontFamily: currentTheme.font.light
   }
});

export default withTheme(EmptyPageMessage);
