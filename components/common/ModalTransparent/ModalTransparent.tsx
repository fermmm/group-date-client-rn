import color from "color";
import React, { FC } from "react";
import { Modal, View, StyleSheet, Pressable } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

interface PropsModalTransparent {
   visible?: boolean;
   onClose?: () => void;
   onBackButtonPress?: () => void;
   closeWithBackButton?: boolean;
}

export const ModalTransparent: FC<PropsModalTransparent> = props => {
   const {
      visible = true,
      onClose,
      children,
      closeWithBackButton = true,
      onBackButtonPress
   } = props;

   return (
      <Modal
         animationType="fade"
         onRequestClose={() => {
            closeWithBackButton && onClose?.();
            onBackButtonPress?.();
         }}
         onDismiss={() => onClose?.()}
         visible={visible}
         statusBarTranslucent
         transparent
      >
         <View style={styles.modal}>
            <Pressable
               style={styles.darkUnderlay}
               onPress={onClose != null ? () => onClose() : null}
            />
            {children}
         </View>
      </Modal>
   );
};

const styles: Styles = StyleSheet.create({
   modal: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 0,
      zIndex: 100,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
   },
   darkUnderlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: color("black").alpha(0.4).toString()
   }
});
