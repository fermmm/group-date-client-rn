import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Surface, SurfaceProps } from "react-native-paper";

class SurfaceStyled extends Component<SurfaceProps> {
   static defaultProps: Partial<SurfaceProps> = {};

   render(): JSX.Element {
      return (
         <Surface style={[styles.surface, this.props.style]}>
            {this.props.children}
         </Surface>
      );
   }
}

const styles: Styles = StyleSheet.create({
   surface: {
      marginBottom: 10,
      padding: 12,
      borderRadius: 10,
      
      // Shadow styles:
      elevation: 9,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
   },
});

export default SurfaceStyled;
