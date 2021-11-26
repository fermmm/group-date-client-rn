import React, { FC } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { currentTheme } from "../../../config";

export interface ButtonForAppBarProps {
   icon?: IconSource;
   onPress?: () => void;
   style?: StyleProp<ViewStyle>;
   labelStyle?: StyleProp<TextStyle>;
}

const ButtonForAppBar: FC<ButtonForAppBarProps> = props => {
   return (
      <Button
         mode="outlined"
         uppercase={false}
         style={[{ borderColor: currentTheme.colors.text2 }, props.style]}
         color={currentTheme.colors.text2}
         icon={props.icon}
         onPress={props.onPress}
         labelStyle={props.labelStyle}
      >
         {props.children}
      </Button>
   );
};

export default ButtonForAppBar;
