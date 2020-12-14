import React, { Component } from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { withTheme, Text } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Picker } from "@react-native-picker/picker";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import { currentTheme } from "../../../config";

export interface NewUsersSelectorProps extends Themed {
   style?: StyleProp<ViewStyle>;
   checked: boolean;
   amountSelected: number;
   onAmountChange(amountSelected: number): void;
   onCheckChange(): void;
}

class NewUsersNotificationSelector extends Component<NewUsersSelectorProps> {
   static defaultProps: Partial<NewUsersSelectorProps> = {};
   amountOptions: number[] = this.generateAmountOptionsArray();

   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;
      const {
         amountSelected,
         checked,
         onAmountChange,
         onCheckChange
      }: Partial<NewUsersSelectorProps> = this.props;

      return (
         <View style={[styles.mainContainer, this.props.style]}>
            <CheckboxButton checked={checked} onPress={() => onCheckChange()}>
               <Text style={styles.text}>
                  Mostrarme una notificación cuando haya usuaries nuevos
               </Text>
            </CheckboxButton>
            {checked && (
               <View style={styles.amountSelectorContainer}>
                  <Text style={styles.text}>Cuando haya</Text>
                  <Picker
                     selectedValue={amountSelected}
                     style={styles.picker}
                     onValueChange={itemValue => onAmountChange(Number(itemValue))}
                  >
                     {this.amountOptions.map((amount, i) => (
                        <Picker.Item label={amount.toString()} value={amount} key={i} />
                     ))}
                  </Picker>
                  <Text style={styles.text}>usuarixs nuevos</Text>
               </View>
            )}
         </View>
      );
   }

   generateAmountOptionsArray(): number[] {
      return [1, 2, 3, 4, 5, 10, 15];
   }
}

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

export default withTheme(NewUsersNotificationSelector);
