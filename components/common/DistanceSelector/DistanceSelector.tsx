import React, { FC, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { AUTOMATIC_TARGET_DISTANCE, AVAILABLE_DISTANCES } from "../../../config";

export interface PropsDistanceSelector {
   value: number;
   onChange(newValue: number): void;
}

const DistanceSelector: FC<PropsDistanceSelector> = props => {
   const [distanceOptions] = useState(AVAILABLE_DISTANCES);

   const distanceToString = (distance: number) => {
      return `${distance} Km ${distance === AUTOMATIC_TARGET_DISTANCE ? " (Recomendado)" : ""}`;
   };

   return (
      <View style={styles.mainContainer}>
         <Picker
            selectedValue={props.value}
            style={styles.picker}
            onValueChange={itemValue => props.onChange(Number(itemValue))}
         >
            {distanceOptions.map((distance, i) => (
               <Picker.Item label={distanceToString(distance)} value={distance} key={i} />
            ))}
         </Picker>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center"
   },
   picker: {
      width: 240,
      height: 45
   },
   text: {
      marginRight: 20,
      fontSize: 18
   }
});

export default DistanceSelector;
