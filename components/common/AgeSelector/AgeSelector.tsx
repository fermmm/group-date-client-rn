import React, { Component } from "react";
import { StyleSheet, View, Picker, Text } from "react-native";
import { withTheme } from "react-native-paper";
import equal from "fast-deep-equal";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import PickerThemed from "../PickerThemed/PickerThemed";

export interface AgeSelectorProps extends Themed {
   min?: number;
   max?: number;
   onChange(newValues: AgeSelectorState): void;
}
export interface AgeSelectorState {
   min: number;
   max: number;
}

class AgeSelector extends Component<AgeSelectorProps, AgeSelectorState> {
   static defaultProps: Partial<AgeSelectorProps> = {};
   ageOptions: number[] = this.generateAgeArray();
   state: AgeSelectorState = {
      min: 18,
      max: 25
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const {min, max}: Partial<AgeSelectorState> = this.state;

      return (
         <View style={styles.mainContainer}>
            <Text style={styles.text}>De:</Text>
            <PickerThemed
               selectedValue={min}
               style={{ height: 50, width: 90 }}
               onValueChange={(itemValue) =>
                  this.setState({ min: itemValue <= max ? itemValue : max }, () => this.sendChanges())
               }>
               {
                  this.ageOptions.map((age, i) =>
                     <Picker.Item label={age.toString()} value={age} key={i} />
                  )
               }
            </PickerThemed>
            <Text style={styles.text}>a:</Text>
            <PickerThemed
               selectedValue={max}
               style={{ height: 50, width: 90 }}
               onValueChange={(itemValue) =>
                  this.setState({ max: itemValue >= min ? itemValue : min}, () => this.sendChanges())
               }>
               {
                  this.ageOptions.map((age, i) =>
                     <Picker.Item label={age.toString()} value={age} key={i} />
                  )
               }
            </PickerThemed>
         </View>
      );
   }

   componentDidUpdate(prevProps: AgeSelectorProps): void {
      if (!equal(prevProps, this.props)) {
         this.setState({
            min: this.props.min, 
            max: this.props.max
         });
      }
   }

   generateAgeArray(): number[] {
      const result: number[] = Array.from({ length: 99 }, (v, k) => ++k);
      result.splice(0, 17);
      return result;
   }

   sendChanges(): void {
      this.props.onChange(this.state);
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
   },
   text: {
      marginRight: 20,
      fontSize: 18
   }
});

export default withTheme(AgeSelector);