import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Paragraph, Button } from "react-native-paper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import { ModalRequiredProps } from "../GlobalModalsProvider/GlobalModalsProvider";
import ModalBackground from "../ModalBackground/ModalBackground";
import ModalWindow from "../ModalWindow/ModalWindow";

export interface PropsDialogModal extends ModalRequiredProps {
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
const DialogModal: FC<PropsDialogModal> = props => {
   const { close, message, blockClosing, buttons = [{ label: "Ok" }] } = props;
   const theme = useTheme();

   const handleButtonPress = (action?: () => void) => {
      action?.();
   };

   return (
      <ModalBackground onClose={blockClosing ? null : () => close()}>
         <ModalWindow>
            <Paragraph style={styles.text}>{message}</Paragraph>
            <View
               style={[
                  styles.buttonsContainer,
                  buttons?.length === 1 && styles.buttonsContainerSingle
               ]}
            >
               {buttons?.map((button, i) => (
                  <Button
                     color={theme.colors.accent2}
                     style={[styles.button, buttons?.length === 1 && styles.buttonSingle]}
                     onPress={() => {
                        handleButtonPress(button.onPress);
                        button.closesModal === false ? null : close();
                     }}
                     key={i}
                  >
                     {button.label}
                  </Button>
               ))}
            </View>
         </ModalWindow>
      </ModalBackground>
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
