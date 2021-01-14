import React, { FC } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { FAB } from "react-native-paper";
import { currentTheme } from "../../../../config";

export interface EditButtonProps {
   showAtBottom?: boolean;
   absolutePosition?: boolean;
   label?: string;
   style?: StyleProp<ViewStyle>;
   onPress?: () => void;
}
export interface EditButtonState {}

const EditButton: FC<EditButtonProps> = props => {
   const { absolutePosition = true, label, style, showAtBottom, onPress } = props;

   return (
      <FAB
         label={label}
         style={[
            style,
            styles.fab,
            showAtBottom && { bottom: 0 },
            absolutePosition && { position: "absolute" }
         ]}
         icon="pencil"
         onPress={onPress}
      />
   );
};

const styles: Styles = StyleSheet.create({
   fab: {
      margin: 5,
      right: 0,
      transform: [{ scale: 0.85 }],
      backgroundColor: currentTheme.colors.primary
   }
});

export default EditButton;
