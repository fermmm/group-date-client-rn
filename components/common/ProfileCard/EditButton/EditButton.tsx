import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { FAB, FABProps } from "react-native-paper";
import { currentTheme } from '../../../../config';

export interface EditButtonProps extends Partial<FABProps> { 
   showAtBottom?: boolean;
   absolutePosition?: boolean;
}
export interface EditButtonState { }

class EditButton extends Component<EditButtonProps, EditButtonState> {
   static defaultProps: Partial<EditButtonProps> = {
      absolutePosition: true
   };

   render(): JSX.Element {
      return (
         <FAB
            {...this.props}
            style={[
               this.props.style, 
               styles.fab, 
               this.props.showAtBottom && {bottom: 0},
               this.props.absolutePosition && {position: "absolute"}
            ]}
            icon="edit"
         />
      );
   }
}

const styles: Styles = StyleSheet.create({
   fab: {
      margin: 5,
      right: 0,
      transform: [{scale: 0.85}],
      backgroundColor: currentTheme.colors.primary,
   },
});

export default EditButton;
