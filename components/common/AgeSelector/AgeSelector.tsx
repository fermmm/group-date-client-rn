import React, { FC, useState } from "react";
import { StyleSheet, View, Text, StyleProp, ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { MAX_AGE_ALLOWED, MIN_AGE_ALLOWED } from "../../../config";

export interface PropsAgeRangeSelector {
   min?: number;
   max?: number;
   style?: StyleProp<ViewStyle>;
   onChange(newValues: { min: number; max: number }): void;
}

export const AgeRangeSelector: FC<PropsAgeRangeSelector> = ({ min, max, onChange, style }) => {
   const [ageOptions] = useState(
      Array.from({ length: MAX_AGE_ALLOWED }, (v, k) => ++k).slice(MIN_AGE_ALLOWED - 1)
   );

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
      width: 90,
      height: 50
   }
});

export default AgeRangeSelector;
