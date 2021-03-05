import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import { useNavigation } from "@react-navigation/native";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";

const ButtonBack: FC = () => {
   const navigation = useNavigation();

   return (
      <ViewTouchable style={styles.container} onPress={() => navigation.goBack()}>
         <FAB style={styles.fab} icon="arrow-left" onPress={() => navigation.goBack()} small />
      </ViewTouchable>
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
