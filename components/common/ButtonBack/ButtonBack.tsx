import React, { FC } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { FAB } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import color from "color";
import { useNavigation } from "@react-navigation/native";

const ButtonBack: FC = props => {
   const navigation = useNavigation();

   return (
      <TouchableHighlight
         style={styles.container}
         onPress={() => navigation.goBack()}
         underlayColor={color("white").alpha(0).string()}
         activeOpacity={1}
      >
         <FAB style={styles.fab} icon="arrow-left" onPress={() => navigation.goBack()} small />
      </TouchableHighlight>
   );
};

const styles: Styles = StyleSheet.create({
   container: {
      position: "absolute",
      padding: 20,
      left: 0,
      top: 25,
      zIndex: 100
   },
   fab: {
      backgroundColor: currentTheme.colors.surface
   }
});

export default ButtonBack;
