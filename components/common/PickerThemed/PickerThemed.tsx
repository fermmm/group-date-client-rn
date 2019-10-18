import React, { Component } from "react";
import { StyleSheet, Picker, PickerProps } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PickerThemedProps extends PickerProps, Themed { }

class PickerThemed extends Component<PickerThemedProps> {
   static defaultProps: Partial<PickerThemedProps> = {};

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <Picker
            {...this.props}
         >
            {this.props.children}
         </Picker>
      );
   }
}

const styles: Styles = StyleSheet.create({

});

export default withTheme(PickerThemed);