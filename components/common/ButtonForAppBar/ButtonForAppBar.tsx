import React, { Component } from "react";
import { Button } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";
import { currentTheme } from "../../../config";

export interface ButtonForAppBarProps {
   icon?: IconSource;
   onPress?: () => void;
}

class ButtonForAppBar extends Component<ButtonForAppBarProps> {
   static defaultProps: Partial<ButtonForAppBarProps> = {};

   render(): JSX.Element {
      return (
         <Button
            mode="outlined"
            uppercase={false}
            style={{ borderColor: currentTheme.colors.text2 }}
            color={currentTheme.colors.text2}
            icon={this.props.icon}
            onPress={this.props.onPress}
         >
            {this.props.children}
         </Button>
      );
   }
}

export default ButtonForAppBar;
