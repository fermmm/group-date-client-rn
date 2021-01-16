import React, { FC } from "react";
import { Modal } from "react-native";
import { Dialog as PaperDialog, Paragraph, Button } from "react-native-paper";

export interface PropsDialog {
   buttons?: DialogButton[];
}

export interface DialogButton {
   label: string;
   onTouch?: () => void;
}

const Dialog: FC<PropsDialog & React.ComponentProps<typeof PaperDialog>> = props => {
   const { buttons = [{ label: "Aceptar", onTouch: () => props.onDismiss() }] } = props;

   return (
      <PaperDialog {...props}>
         <PaperDialog.Content>
            <Paragraph>{props.children}</Paragraph>
         </PaperDialog.Content>
         <PaperDialog.Actions>
            {buttons.map((button, i) => (
               <Button
                  onPress={() => {
                     button.onTouch();
                     props.onDismiss();
                  }}
                  key={i}
               >
                  {button.label}
               </Button>
            ))}
         </PaperDialog.Actions>
      </PaperDialog>
   );
};

export default Dialog;
