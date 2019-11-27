import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Badge, Text, BadgeProps } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface BadgeExtendedProps extends BadgeProps { 
   showAtLeftSide?: boolean;
   extraX?: number;
   extraY?: number;
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
            {...this.props}
            style={[
                  this.props.style, 
                  styles.mainStyle, 
                  {top: -4 + extraY},
                  showAtLeftSide ? 
                     {left: -12 + extraX}
                  : 
                     {right: -9 + extraX}
            ]}
         >
            <Text
               style={{ color: currentTheme.colors.text2 }}
            >
               {this.props.children}
            </Text>
         </Badge>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainStyle: {
      position: "absolute",
   },
});

export default BadgeExtended;