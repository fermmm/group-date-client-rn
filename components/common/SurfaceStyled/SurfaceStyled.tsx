import React, { ComponentProps, FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Surface } from "react-native-paper";
import { currentTheme } from "../../../config";

const SurfaceStyled: FC<ComponentProps<typeof Surface>> = ({ style, children }) => {
   return <Surface style={[styles.surface, style]}>{children}</Surface>;
};

const styles: Styles = StyleSheet.create({
   surface: {
      marginBottom: 10,
      padding: 12,
      borderRadius: currentTheme.roundnessSmall,

      // Shadow styles:
      elevation: 9,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 4
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.46
   }
});

export default SurfaceStyled;
