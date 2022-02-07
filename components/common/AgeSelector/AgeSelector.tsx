import React, { FC, useState } from "react";
import { StyleSheet, View, Text, StyleProp, ViewStyle, Platform } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { MAX_AGE_ALLOWED, MIN_AGE_ALLOWED } from "../../../config";
import Picker from "../Picker/Picker";

export interface PropsAgeRangeSelector {
   min?: number;
   max?: number;
   style?: StyleProp<ViewStyle>;
   onChange(newValues: { min: number; max: number }): void;
}

export const AgeRangeSelector: FC<PropsAgeRangeSelector> = ({ min, max, onChange, style }) => {
   const [ageOptions] = useState(
      Array.from({ length: MAX_AGE_ALLOWED }, (v, k) => ++k)
         .slice(MIN_AGE_ALLOWED - 1)
         .map(age => ({ label: age.toString(), value: age }))
   );

   return (
      <View style={[styles.mainContainer, style]}>
         <Text style={styles.text}>De:</Text>
         <Picker
            items={ageOptions}
            value={min}
            onChange={newMin =>
               onChange({ min: Number(newMin), max: Number(newMin) > max ? Number(newMin) : max })
            }
         />
         <Text style={styles.text}>a:</Text>
         <Picker
            items={ageOptions}
            value={max}
            onChange={newMax =>
               onChange({ max: Number(newMax), min: Number(newMax) < min ? Number(newMax) : min })
            }
         />
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
