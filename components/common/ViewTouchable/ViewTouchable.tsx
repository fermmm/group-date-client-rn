import React, { ComponentProps, FC } from "react";
import { TouchableRipple } from "react-native-paper";
import color from "color";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface PropsViewTouchable {
   defaultRippleColor?: string;
   defaultAlpha?: number;
}

type TouchableRippleProps = Omit<
   ComponentProps<typeof TouchableRipple>,
   "hasTVPreferredFocus" | "tvParallaxProperties"
>;

export const ViewTouchable: FC<TouchableRippleProps & PropsViewTouchable> = props => {
   const { colors, roundness } = useTheme();
   const rippleColor = color(props?.defaultRippleColor ?? "black")
      .alpha(props?.defaultAlpha ?? 0.2)
      .toString();

   return (
      <TouchableRipple
         borderless
         rippleColor={rippleColor}
         {...props}
         style={[{ borderRadius: roundness, flexShrink: 1 }, props.style]}
      >
         {props.children}
      </TouchableRipple>
   );
};
