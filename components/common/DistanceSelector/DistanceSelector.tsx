import React, { Component } from "react";
import { StyleSheet, View, Picker, Text } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import PickerThemed from "../PickerThemed/PickerThemed";

export interface DistanceSelectorProps extends Themed {
   value: number;
   onChange(newValue: number): void;
}

class DistanceSelector extends Component<DistanceSelectorProps> {
   distanceOptions: number[] = this.generateDistanceOptions();
   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <View style={styles.mainContainer}>
            <PickerThemed
               selectedValue={this.props.value}
               style={{ height: 50, width: 90 }}
               onValueChange={itemValue => this.props.onChange(itemValue)}
            >
               {
                  this.distanceOptions.map((distance, i) =>
                     <Picker.Item label={distance.toString()} value={distance} key={i} />
                  )
               }
            </PickerThemed>
            <Text style={styles.text}>Km</Text>
         </View>
      );
   }

   generateDistanceOptions(): number[] {
      const result: number[] = Array.from({ length: 20 }, (v, k) => k + 5);
      return result;
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center"
   },
   text: {
      marginRight: 20,
      fontSize: 18
   }
});

export default withTheme(DistanceSelector);