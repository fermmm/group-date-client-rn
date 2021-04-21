import React, { ComponentProps, FC } from "react";
import { TouchableRipple } from "react-native-paper";
import color from "color";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface PropsViewTouchable {
   defaultRippleColor?: string;
   defaultAlpha?: number;
}
export const ViewTouchable: FC<
   ComponentProps<typeof TouchableRipple> & PropsViewTouchable
> = props => {
   const { colors, roundness } = useTheme();

   return (
      <TouchableRipple
         borderless
         rippleColor={color(props?.defaultRippleColor ?? "black")
            .alpha(props?.defaultAlpha ?? 0.32)
            .toString()}
         {...props}
         style={[{ borderRadius: roundness }, props.style]}
      >
         {props.children}
      </TouchableRipple>
   );
};
