import React, { FC } from "react";
import { Button } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";
import { currentTheme } from "../../../config";

export interface ButtonForAppBarProps {
   icon?: IconSource;
   onPress?: () => void;
}

const ButtonForAppBar: FC<ButtonForAppBarProps> = props => {
   return (
      <Button
         mode="outlined"
         uppercase={false}
         style={{ borderColor: currentTheme.colors.text2 }}
         color={currentTheme.colors.text2}
         icon={props.icon}
         onPress={props.onPress}
      >
         {props.children}
      </Button>
   );
};

export default ButtonForAppBar;
