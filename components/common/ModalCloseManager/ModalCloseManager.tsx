import React, { FC } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PropsModalCloseManager {
   onClose?: () => void;
}

const ModalCloseManager: FC<PropsModalCloseManager> = props => {
   const { onClose, children } = props;

   return (
      <TouchableWithoutFeedback onPress={onClose}>
         <View style={styles.modalContainer}>
            {/** This touchable blocks the action of the parent one to prevent closing when clicking on the modal */}
            <TouchableWithoutFeedback>
               <View>{children}</View>
            </TouchableWithoutFeedback>
         </View>
      </TouchableWithoutFeedback>
   );
};

const styles: Styles = StyleSheet.create({
   modalContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flex: 1
   }
});

export default ModalCloseManager;
