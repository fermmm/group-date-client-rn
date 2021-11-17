import React, { FC } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PropsModalCloseManager {
   onClose?: () => void;
   contentPosition?: "center" | "bottom";
}

const ModalCloseManager: FC<PropsModalCloseManager> = props => {
   const { onClose, children, contentPosition = "center" } = props;

   return (
      <TouchableWithoutFeedback onPress={onClose}>
         <View
            style={[
               styles.modalContainer,
               { alignItems: contentPosition === "center" ? "center" : "flex-end" }
            ]}
         >
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
