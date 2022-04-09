import React, { FC } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { FAB } from "react-native-paper";
import color from "color";
import { PolyamorySymbol } from "../../../../assets/PolyamorySymbol";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { currentTheme } from "../../../../config";

export interface LikeDislikeProps {
   style?: StyleProp<ViewStyle>;
   onLikePress?: () => void;
   onDislikePress?: () => void;
   onUndoPress?: () => void;
   onFlagPress?: () => void;
}

const LikeDislikeButtons: FC<LikeDislikeProps> = props => {
   const { colors } = useTheme();

   return (
      <>
         <View style={[styles.container, props.style]}>
            <View style={styles.buttonContainer}>
               <FAB
                  style={styles.dislikeButton}
                  color={color(colors.background).darken(0.4).string()}
                  icon="close"
                  onPress={props.onDislikePress}
               />
            </View>
            <View style={styles.buttonContainer}>
               <FAB
                  style={styles.likeButton}
                  color={color(colors.accent).darken(0.04).string()}
                  icon={({ color: c }) => <PolyamorySymbol color={c} style={styles.logo} />}
                  onPress={props.onLikePress}
               />
            </View>
         </View>
         {props.onUndoPress != null && (
            <FAB
               style={styles.undoButton}
               color={color(colors.background).darken(0.4).string()}
               icon="undo-variant"
               onPress={props.onUndoPress}
            />
         )}
         <FAB
            style={styles.flagButton}
            color={color(colors.background).darken(0.4).string()}
            icon="flag"
            onPress={props.onFlagPress}
         />
      </>
   );
};

const styles: Styles = StyleSheet.create({
   container: {
      width: 140, // This controls how close together the buttons are placed.
      height: "auto",
      flexDirection: "row",
      position: "absolute",
      justifyContent: "space-around",
      // backgroundColor: currentTheme.colors.background,
      padding: 5,
      borderRadius: currentTheme.roundness
   },
   buttonContainer: {
      width: "auto"
   },
   likeButton: { backgroundColor: currentTheme.colors.accent2 },
   dislikeButton: {
      backgroundColor: color(currentTheme.colors.surface).darken(0.1).desaturate(0.2).string()
   },
   undoButton: {
      position: "absolute",
      left: 60,
      bottom: 22,
      backgroundColor: "transparent",
      elevation: 0,
      shadowOpacity: 0
   },
   flagButton: {
      position: "absolute",
      right: 60,
      bottom: 22,
      backgroundColor: "transparent",
      elevation: 0,
      shadowOpacity: 0
   }
});

export default LikeDislikeButtons;
