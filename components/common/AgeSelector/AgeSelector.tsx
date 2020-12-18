import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Text, StyleProp, ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PropsAgeRangeSelector {
   min?: number;
   max?: number;
   style?: StyleProp<ViewStyle>;
   onChange(newValues: { min: number; max: number }): void;
}

export const AgeRangeSelector: FC<PropsAgeRangeSelector> = ({ min, max, onChange, style }) => {
   const [ageOptions] = useState(Array.from({ length: 179 }, (v, k) => ++k).slice(18 - 1));

   return (
      <View style={[styles.mainContainer, style]}>
         <Text style={styles.text}>De:</Text>
         <Picker
            selectedValue={min}
            style={styles.picker}
            onValueChange={newMin =>
               onChange({ min: Number(newMin), max: Number(newMin) > max ? Number(newMin) : max })
            }
         >
            {ageOptions.map((age, i) => (
               <Picker.Item label={age.toString()} value={age} key={i} />
            ))}
         </Picker>
         <Text style={styles.text}>a:</Text>
         <Picker
            selectedValue={max}
            style={styles.picker}
            onValueChange={newMax =>
               onChange({ max: Number(newMax), min: Number(newMax) < min ? Number(newMax) : min })
            }
         >
            {ageOptions.map((age, i) => (
               <Picker.Item label={age.toString()} value={age} key={i} />
            ))}
         </Picker>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start"
   },
   text: {
      marginRight: 20,
      fontSize: 18
   },
   picker: {
      width: 85,
      height: 50
   }
});

export default AgeRangeSelector;
