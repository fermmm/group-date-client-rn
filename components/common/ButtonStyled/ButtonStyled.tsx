import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Button, ButtonProps } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";

class ButtonStyled extends Component<Partial<ButtonProps>> {
   render(): JSX.Element {
      return (
         <Button
            mode="outlined"
            uppercase={false}
            {...this.props}
            style={[styles.button, this.props.style]}
            contentStyle={[styles.buttonContent, this.props.contentStyle]}
         >
            {this.props.children}
         </Button>
      );
   }
}

const styles: Styles = StyleSheet.create({
   button: {
      width: "100%",
      marginBottom: 15,
   },
   buttonContent: {
      width: "100%",
      height: 45,
   }
});

export default ButtonStyled;