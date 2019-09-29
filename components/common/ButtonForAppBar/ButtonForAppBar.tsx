import React, { Component } from "react";
import { Button, ButtonProps } from "react-native-paper";
import { currentTheme } from "../../../config";

export interface ButtonForAppBarProps extends ButtonProps {}

class ButtonForAppBar extends Component<ButtonForAppBarProps> {
   static defaultProps: Partial<ButtonForAppBarProps> = {};

   render(): JSX.Element {
      return (
         <Button
            mode="outlined"
            uppercase={false}
            style={{borderColor: currentTheme.colors.text2}}
            color={currentTheme.colors.text2}
            {...this.props}
         >
            {this.props.children}
         </Button>
      );
   }
}

export default ButtonForAppBar;