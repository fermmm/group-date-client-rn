import React, { FC, useRef } from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Picker } from "@react-native-picker/picker";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import { currentTheme } from "../../../config";

export interface NewUsersSelectorProps {
   style?: StyleProp<ViewStyle>;
   checked: boolean;
   amountSelected: number;
   onAmountChange(amountSelected: number): void;
   onCheckChange(): void;
}

const NewUsersNotificationSelector: FC<NewUsersSelectorProps> = props => {
   const amountOptions = useRef<number[]>([1, 2, 3, 4, 5, 10, 15]);
   const {
      amountSelected,
      checked,
      onAmountChange,
      onCheckChange
   }: Partial<NewUsersSelectorProps> = props;

   return (
      <View style={[styles.mainContainer, props.style]}>
         <CheckboxButton checked={checked} onPress={() => onCheckChange()}>
            <Text style={styles.text}>Mostrarme una notificación cuando haya usuarixs nuevos</Text>
         </CheckboxButton>
         {checked && (
            <View style={styles.amountSelectorContainer}>
               <Text style={styles.text}>Cuando haya</Text>
               <Picker
                  selectedValue={amountSelected}
                  style={styles.picker}
                  onValueChange={itemValue => onAmountChange(Number(itemValue))}
               >
                  {amountOptions.current.map((amount, i) => (
                     <Picker.Item label={amount.toString()} value={amount} key={i} />
                  ))}
               </Picker>
               <Text style={styles.text}>usuarixs nuevxs</Text>
            </View>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start"
   },
   text: {
      marginRight: 0,
      fontSize: 13,
      fontFamily: currentTheme.font.light
   },
   picker: {
      width: 85,
      height: 40,
      marginRight: -12,
      transform: [{ scale: 0.8 }],
      marginTop: -10,
      marginBottom: -10
   },
   amountSelectorContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      marginLeft: 37
   }
});

export default NewUsersNotificationSelector;
