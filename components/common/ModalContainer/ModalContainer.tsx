import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

const ModalContainer: FC = ({ children }) => {
   return <View style={styles.modalBody}>{children}</View>;
};

const styles: Styles = StyleSheet.create({
   modalBody: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentTheme.colors.backgroundBottomGradient,
      borderRadius: currentTheme.roundnessSmall,
      minWidth: "75%",
      maxWidth: "90%",
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10
   }
});

export default ModalContainer;
