import React, { ComponentProps, FC } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";

const ButtonStyled: FC<ComponentProps<typeof Button>> = props => {
   return (
      <Button
         mode="outlined"
         uppercase={false}
         {...props}
         style={[styles.button, props.style]}
         contentStyle={[styles.buttonContent, props.contentStyle]}
      >
         {props.children}
      </Button>
   );
};

const styles: Styles = StyleSheet.create({
   button: {
      width: "100%",
      marginBottom: 15
   },
   buttonContent: {
      width: "100%",
      height: 45
   }
});

export default ButtonStyled;
