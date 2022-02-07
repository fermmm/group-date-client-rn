import React, { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as RnPicker from "@react-native-picker/picker";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PropsPicker<T = number> {
   items: Array<{ label: string; value: T }>;
   value: T;
   onChange(newValue: T): void;
}

const Picker: FC<PropsPicker> = props => {
   const { items, value, onChange } = props;

   return (
      <View style={styles.mainContainer}>
         <RnPicker.Picker
            selectedValue={value}
            style={styles.picker}
            onValueChange={itemValue => onChange(itemValue)}
         >
            {items.map((item, i) => (
               <RnPicker.Picker.Item label={item.label} value={item.value} key={i} />
            ))}
         </RnPicker.Picker>
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
      width: "100%",
      height: Platform.OS === "ios" ? 214 : 45
   },
   text: {
      marginRight: 20,
      fontSize: 18
   }
});

export default Picker;
