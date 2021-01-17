import React, { FC } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { FAB } from "react-native-paper";
import color from "color";
import { LogoSvg } from "../../../../assets/LogoSvg";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";

export interface LikeDislikeProps {
   style?: StyleProp<ViewStyle>;
   onLikeClick: () => void;
   onDislikeClick: () => void;
}

const LikeDislikeButtons: FC<LikeDislikeProps> = props => {
   const { colors } = useTheme();

   return (
      <View style={[styles.container, props.style]}>
         <View style={styles.button}>
            <FAB
               style={{
                  backgroundColor: color(colors.surface).darken(0.1).desaturate(0.2).string()
               }}
               color={color(colors.background).darken(0.4).string()}
               icon="close"
               onPress={() => props.onDislikeClick()}
            />
         </View>
         <View style={styles.button}>
            <FAB
               style={{ backgroundColor: colors.accent2 }}
               color={color(colors.accent).darken(0.04).string()}
               icon={({ color: c }) => <LogoSvg color={c} style={styles.logo} />}
               onPress={() => props.onLikeClick()}
            />
         </View>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   container: {
      width: 130, // This controls how close together the buttons are placed.
      height: "auto",
      flexDirection: "row",
      position: "absolute",
      justifyContent: "space-around"
   },
   button: {
      width: "auto"
   }
});

export default LikeDislikeButtons;
