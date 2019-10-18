import React, { Component } from "react";
import { StyleSheet, View, Picker } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import PickerThemed from "../PickerThemed/PickerThemed";

export interface AgeSelectorProps extends Themed { }
export interface AgeSelectorState { 
   ageFrom: string;
}

class AgeSelector extends Component<AgeSelectorProps, AgeSelectorState> {
   static defaultProps: Partial<AgeSelectorProps> = {};
   state: AgeSelectorState = {
      ageFrom: ""
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <PickerThemed
            selectedValue={this.state.ageFrom}
            style={{height: 50, width: 90}}
            onValueChange={(itemValue, itemIndex) =>
               this.setState({ageFrom: itemValue})
         }>
            {
               this.generateAgeArray().map((age, i) =>
                  <Picker.Item label={age.toString()} value={age} key={i}/>
               )
            }
         </PickerThemed>
      );
   }

   generateAgeArray(): number[] {
      const result: number[] = Array.from({length: 99}, (v, k) => ++k);
      result.splice(0, 17);
      return result;
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
   },
});

export default withTheme(AgeSelector);