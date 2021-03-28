import color from "color";
import React, { FC } from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { ViewTouchable } from "../../../common/ViewTouchable/ViewTouchable";

interface PropsWatchingIndicator {
   name: string;
   onPress: () => void;
}

const WatchingIndicator: FC<PropsWatchingIndicator> = ({ name, onPress }) => {
   const { colors } = useTheme();
   return (
      <ViewTouchable onPress={onPress} style={styles.mainContainer}>
         <Text style={styles.mainText}>
            Estas viendo <Text style={styles.indicationText}>{name}</Text> toca para salir
         </Text>
      </ViewTouchable>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flexDirection: "row",
      alignItems: "center",
      zIndex: 20,
      backgroundColor: color(currentTheme.colors.accent).alpha(0.7).string(),
      alignSelf: "flex-end",
      marginTop: 15,
      marginLeft: 10,
      marginRight: 10,
      padding: 10,
      borderRadius: currentTheme.roundness
   },
   mainText: {
      color: currentTheme.colors.text,
      fontSize: 11,
      fontFamily: currentTheme.font.light,
      marginLeft: 4
   },
   indicationText: {
      color: currentTheme.colors.text,
      fontSize: 11,
      fontFamily: currentTheme.font.medium
   }
});

export default WatchingIndicator;
