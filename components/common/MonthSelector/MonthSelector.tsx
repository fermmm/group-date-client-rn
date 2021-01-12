import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { MONTHS_NAMES, MONTHS_NUMBERS } from "../../../api/tools/date-tools";
import I18n from "i18n-js";

export interface PropsMonthSelector {
   value: number;
   onChange(newValue: number): void;
}

const MonthSelector: FC<PropsMonthSelector> = props => {
   return (
      <View style={styles.mainContainer}>
         <Picker
            selectedValue={props.value}
            style={styles.picker}
            onValueChange={itemValue => props.onChange(Number(itemValue))}
         >
            {MONTHS_NUMBERS.map((month, i) => (
               <Picker.Item label={I18n.t(MONTHS_NAMES[month])} value={month} key={i} />
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
      width: 180,
      height: 45
   },
   text: {
      marginRight: 20,
      fontSize: 18
   }
});

export default MonthSelector;
