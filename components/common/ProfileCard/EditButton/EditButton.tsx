import React, { Component } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { FAB } from "react-native-paper";
import { currentTheme } from "../../../../config";

export interface EditButtonProps {
   showAtBottom?: boolean;
   absolutePosition?: boolean;
   label: string;
   style?: StyleProp<ViewStyle>;
   onPress?: () => void;
}
export interface EditButtonState {}

class EditButton extends Component<EditButtonProps, EditButtonState> {
   static defaultProps: Partial<EditButtonProps> = {
      absolutePosition: true
   };

   render(): JSX.Element {
      return (
         <FAB
            label={this.props.label}
            style={[
               this.props.style,
               styles.fab,
               this.props.showAtBottom && { bottom: 0 },
               this.props.absolutePosition && { position: "absolute" }
            ]}
            icon="edit"
            onPress={this.props.onPress}
         />
      );
   }
}

const styles: Styles = StyleSheet.create({
   fab: {
      margin: 5,
      right: 0,
      transform: [{ scale: 0.85 }],
      backgroundColor: currentTheme.colors.primary
   }
});

export default EditButton;
