import React, { FC } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Badge } from "react-native-paper";
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

const BadgeExtended: FC<BadgeExtendedProps> = props => {
   const { size = 25, extraX = 0, extraY = 0, showAtLeftSide, amount, style } = props;
   if (amount == null || amount <= 0) {
      return null;
   }

   return (
      <Badge
         visible
         size={size}
         style={[
            style,
            styles.mainStyle,
            { top: -4 + extraY },
            { color: currentTheme.colors.text2 },
            showAtLeftSide ? { left: -12 + extraX } : { right: -9 + extraX }
         ]}
      >
         {amount}
      </Badge>
   );
};

const styles: Styles = StyleSheet.create({
   mainStyle: {
      position: "absolute"
   }
});

export default BadgeExtended;
