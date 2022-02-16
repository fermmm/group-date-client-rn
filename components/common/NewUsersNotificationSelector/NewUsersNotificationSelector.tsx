import React, { FC, useMemo, useRef } from "react";
import { StyleSheet, View, StyleProp, ViewStyle, Platform } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import { currentTheme } from "../../../config";
import Picker from "../Picker/Picker";

export interface NewUsersSelectorProps {
   style?: StyleProp<ViewStyle>;
   checked: boolean;
   amountSelected: number;
   onAmountChange(amountSelected: number): void;
   onCheckChange(): void;
}

const NewUsersNotificationSelector: FC<NewUsersSelectorProps> = props => {
   const amountOptions = useMemo(
      () => [1, 2, 3, 4, 5, 10, 15].map(option => ({ label: option.toString(), value: option })),
      []
   );
   const {
      amountSelected,
      checked,
      onAmountChange,
      onCheckChange
   }: Partial<NewUsersSelectorProps> = props;

   return (
      <View style={[styles.mainContainer, props.style]}>
         <CheckboxButton checked={checked} onPress={() => onCheckChange()}>
            <Text style={styles.text}>Mostrarme una notificación cuando haya más personas</Text>
         </CheckboxButton>
         {checked && (
            <View style={styles.amountSelectorContainer}>
               <Text style={styles.text}>Cuando haya</Text>
               <Picker
                  items={amountOptions}
                  value={amountSelected}
                  onChange={itemValue => onAmountChange(Number(itemValue))}
               />
               <Text style={styles.text}>personas nuevxs</Text>
            </View>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "100%",
      flexDirection: "column"
   },
   text: {
      marginRight: 0,
      fontSize: 13,
      fontFamily: currentTheme.font.light
   },
   picker: {
      transform: Platform.OS === "android" ? [{ scale: 0.8 }] : [],
      marginTop: Platform.OS === "android" ? -10 : 0,
      marginBottom: Platform.OS === "android" ? -10 : 0
   },
   amountSelectorContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Platform.OS === "ios" ? 40 : 0
   }
});

export default NewUsersNotificationSelector;
