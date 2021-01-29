import color from "color";
import React, { FC } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";

interface PropsWatchingIndicator {
   name: string;
   onPress: () => void;
}

const WatchingIndicator: FC<PropsWatchingIndicator> = ({ name, onPress }) => {
   const { colors } = useTheme();
   return (
      <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
         <Icon name={"eye"} color={colors.text} size={20} />
         <Text style={styles.mainText}>
            <Text style={styles.indicationText}>{name}.</Text> Toca para salir
         </Text>
      </TouchableOpacity>
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
