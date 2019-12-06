import React, { Component } from "react";
import { StyleSheet, View, Picker, StyleProp, ViewStyle } from "react-native";
import { withTheme, Text } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import PickerThemed from "../PickerThemed/PickerThemed";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import { currentTheme } from "../../../config";

export interface NewUsersSelectorProps extends Themed {
   style?: StyleProp<ViewStyle>;
   checked: boolean;
   ammountSelected: number;
   onAmmountChange(ammountSelected: number): void;
   onCheckChange(): void;
}

class NewUsersNotificationSelector extends Component<NewUsersSelectorProps> {
   static defaultProps: Partial<NewUsersSelectorProps> = {};
   ammountOptions: number[] = this.generateAmmountOptionsArray();

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const {ammountSelected, checked, onAmmountChange, onCheckChange}: Partial<NewUsersSelectorProps> = this.props;

      return (
         <View style={[styles.mainContainer, this.props.style]}>
            <CheckboxButton 
               checked={checked}
               onPress={() => onCheckChange()}
            >
               <Text style={styles.text}>
                  Mostrarme una notificación cuando haya usuaries nuevos 
               </Text>
            </CheckboxButton>
            {
               checked &&
                  <View style={styles.ammountSelectorContainer}>
                     <Text style={styles.text}>Cuando haya</Text>
                     <PickerThemed
                        selectedValue={ammountSelected}
                        style={styles.picker}
                        onValueChange={(itemValue) => onAmmountChange(itemValue)}
                     >
                        {
                           this.ammountOptions.map((ammount, i) =>
                              <Picker.Item label={ammount.toString()} value={ammount} key={i} />
                           )
                        }
                     </PickerThemed>
                     <Text style={styles.text}>usuaries nuevos</Text>
                  </View>
            }
            
         </View>
      );
   }

   generateAmmountOptionsArray(): number[] {
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
      fontFamily: currentTheme.fonts.light
   },
   picker: {
      width: 85,
      height: 40,
      marginRight: -12,
      transform: [{scale: 0.8}],
      marginTop: -10,
      marginBottom: -10
   },
   ammountSelectorContainer: {
      flexDirection: "row", 
      alignItems: "center", 
      flexWrap: "wrap",
      marginLeft: 37
   }
});

export default withTheme(NewUsersNotificationSelector);