import React, { FC, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { MONTHS_NAMES, MONTHS_NUMBERS } from "../../../api/tools/date-tools";
import I18n from "i18n-js";
import Picker from "../Picker/Picker";

export interface PropsMonthSelector {
   value: number;
   onChange(newValue: number): void;
}

const MonthSelector: FC<PropsMonthSelector> = props => {
   const items = useMemo(
      () =>
         MONTHS_NUMBERS.map(month => ({
            label: I18n.t(MONTHS_NAMES[month]),
            value: month
         })),
      []
   );

   return (
      <View style={styles.mainContainer}>
         <Picker
            items={items}
            value={props.value}
            onChange={itemValue => props.onChange(Number(itemValue))}
         />
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      alignItems: Platform.OS === "ios" ? "center" : "flex-start",
      justifyContent: Platform.OS === "ios" ? "center" : "flex-start"
   }
});

export default MonthSelector;
