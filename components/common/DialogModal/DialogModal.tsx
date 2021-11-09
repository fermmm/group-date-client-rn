import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { UsableModalComponentProp } from "react-native-modalfy";
import { Paragraph, Button } from "react-native-paper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import ModalCloseManager from "../ModalCloseManager/ModalCloseManager";
import ModalContainer from "../ModalContainer/ModalContainer";

export interface PropsDialog {
   modal: UsableModalComponentProp<any, any>;
}

export interface DialogModalProps {
   message: string;
   buttons?: DialogButton[];
   blockClosing?: boolean;
}

export interface DialogButton {
   label: string;
   closesModal?: boolean;
   onPress?: () => void;
}

/**
 * When creating a new modal it needs to be added in App.tsx
 */
const DialogModal: FC<PropsDialog> = ({ modal: { closeModal, getParam } }) => {
   const theme = useTheme();
   const message = getParam<keyof DialogModalProps, string>("message") as string;
   const blockClosing = getParam<keyof DialogModalProps, boolean>("blockClosing") as boolean;
   const buttons = getParam<keyof DialogModalProps, DialogButton[]>("buttons", [
      { label: "Aceptar" }
   ]) as DialogButton[];

   return (
      <ModalCloseManager onClose={blockClosing ? null : () => closeModal()}>
         <ModalContainer>
            <Paragraph style={styles.text}>{message}</Paragraph>
            <View
               style={[
                  styles.buttonsContainer,
                  buttons.length === 1 && styles.buttonsContainerSingle
               ]}
            >
               {buttons.map((button, i) => (
                  <Button
                     color={theme.colors.accent2}
                     style={[styles.button, buttons.length === 1 && styles.buttonSingle]}
                     onPress={() => {
                        button.onPress?.();
                        button.closesModal === false ? null : closeModal();
                     }}
                     key={i}
                  >
                     {button.label}
                  </Button>
               ))}
            </View>
         </ModalContainer>
      </ModalCloseManager>
   );
};

const styles: Styles = StyleSheet.create({
   text: {
      color: currentTheme.colors.text,
      fontSize: 16
   },
   buttonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      paddingTop: 10
   },
   buttonsContainerSingle: {
      flexDirection: "column",
      justifyContent: "center",
      width: "100%"
   },
   button: {},
   buttonSingle: {
      width: "100%"
   }
});

export default DialogModal;
