import React, { FC } from "react";
import { Modal } from "react-native";
import { Dialog, Paragraph, Button } from "react-native-paper";

const DialogError: FC<React.ComponentProps<typeof Dialog>> = props => {
   return (
      <Modal animationType="fade" visible={props.visible} transparent>
         <Dialog {...props}>
            <Dialog.Content>
               <Paragraph>{props.children}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
               <Button onPress={() => props.onDismiss()}>Aceptar</Button>
            </Dialog.Actions>
         </Dialog>
      </Modal>
   );
};

export default DialogError;
