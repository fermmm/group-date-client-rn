import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Paragraph, Button, Text } from "react-native-paper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import ModalBackground from "../ModalBackground/ModalBackground";
import ModalWindow from "../ModalWindow/ModalWindow";

export interface PropsAdultConfirmModal {
   onConfirm: () => void;
   onCancel?: () => void;
   close?: () => void;
}

const AdultConfirmModal: FC<PropsAdultConfirmModal> = ({ onConfirm, onCancel, close }) => {
   const theme = useTheme();

   const handleConfirmPress = () => {
      close();
      onConfirm();
   };

   const handleCancelPress = () => {
      close();
      onCancel?.();
   };

   return (
      <ModalBackground onClose={handleCancelPress}>
         <ModalWindow>
            <Text style={styles.sign18}>18+</Text>
            <Paragraph style={styles.text}>
               {"Es posible que aparezca algún contenido para adultos"}
            </Paragraph>
            <View style={[styles.buttonsContainerSingle]}>
               <Button
                  color={theme.colors.accent2}
                  style={[styles.buttonConfirm]}
                  onPress={handleConfirmPress}
                  mode={"outlined"}
               >
                  {"Soy mayor de 18"}
               </Button>
               <Button
                  color={theme.colors.accent2}
                  style={[styles.buttonCancel]}
                  onPress={handleCancelPress}
                  mode={"outlined"}
               >
                  {"Cancelar"}
               </Button>
            </View>
         </ModalWindow>
      </ModalBackground>
   );
};

const styles: Styles = StyleSheet.create({
   sign18: {
      color: currentTheme.colors.text,
      fontSize: 30,
      marginTop: 20,
      marginBottom: 20
   },
   text: {
      color: currentTheme.colors.text,
      fontSize: 16,
      textAlign: "center",
      marginBottom: 14
   },
   buttonsContainerSingle: {
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
      paddingTop: 10
   },
   button: {},
   buttonConfirm: {
      color: currentTheme.colors.text,
      width: "100%",
      borderColor: currentTheme.colors.text,
      marginBottom: 12
   },
   buttonCancel: {
      color: currentTheme.colors.text,
      width: "100%",
      borderColor: currentTheme.colors.text
   }
});

export default AdultConfirmModal;
