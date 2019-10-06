import React, { Component } from "react";
import { Portal, Dialog, Paragraph, Button, DialogProps } from "react-native-paper";

class DialogError extends Component<DialogProps> {
   render(): JSX.Element {
      return (
         <Portal>
            <Dialog {...this.props}>
               <Dialog.Content>
                  <Paragraph>{this.props.children}</Paragraph>
               </Dialog.Content>
               <Dialog.Actions>
                  <Button onPress={() => this.props.onDismiss()}>
                     Aceptar
                  </Button>
               </Dialog.Actions>
            </Dialog>
         </Portal>
      );
   }
}

export default DialogError;
