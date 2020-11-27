import React, { Component, ReactText } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Badge, Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface BadgeExtendedProps {
   amount: number;
   showAtLeftSide?: boolean;
   extraX?: number;
   extraY?: number;
   size?: number;
   style?: StyleProp<TextStyle>;
   children?: null;
}

class BadgeExtended extends Component<BadgeExtendedProps> {
   static defaultProps: Partial<BadgeExtendedProps> = {
      size: 25,
      extraX: 0,
      extraY: 0
   };

   render(): JSX.Element {
      const { showAtLeftSide, extraX, extraY }: Partial<BadgeExtendedProps> = this.props;

      return (
         <Badge
            visible={this.props.amount != null && this.props.amount > 0}
            size={this.props.size}
            style={[
               this.props.style,
               styles.mainStyle,
               { top: -4 + extraY },
               { color: currentTheme.colors.text2 },
               showAtLeftSide ? { left: -12 + extraX } : { right: -9 + extraX }
            ]}
         >
            {this.props.amount}
         </Badge>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainStyle: {
      position: "absolute"
   }
});

export default BadgeExtended;
