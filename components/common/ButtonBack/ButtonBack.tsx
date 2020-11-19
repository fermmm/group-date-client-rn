import React, { Component } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { FAB, FABProps } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { NavigationScreenProp, StackScreenProps, withNavigation } from "@react-navigation/stack";
import { currentTheme } from "../../../config";
import color from "color";

export interface Props extends StackScreenProps, Partial<FABProps> {}

class ButtonBack extends Component<Props> {
   static defaultProps: Partial<Props> = {};

   render(): JSX.Element {
      const { goBack }: StackNavigationProp<Record<string, {}>> = this.props.navigation;

      return (
         <TouchableHighlight
            style={styles.container}
            onPress={() => goBack()}
            underlayColor={color("white").alpha(0).string()}
            activeOpacity={1}
         >
            <FAB
               style={styles.fab}
               icon="arrow-back"
               onPress={() => goBack()}
               small
               {...this.props}
            />
         </TouchableHighlight>
      );
   }
}

const styles: Styles = StyleSheet.create({
   container: {
      position: "absolute",
      padding: 20,
      left: 0,
      top: 25,
      zIndex: 100
   },
   fab: {
      backgroundColor: currentTheme.colors.surface
   }
});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(ButtonBack);
