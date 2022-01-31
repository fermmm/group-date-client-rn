import React, { FC, useCallback, useEffect } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, BackHandler } from "react-native";
import { BlurView } from "expo-blur";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PropsModalBackground {
   onClose?: () => void;
   contentPosition?: "center" | "bottom";
}

/**
 * This component handles the dimmer background but also the back button to close and the dimmer background press to close.
 */
const ModalBackground: FC<PropsModalBackground> = props => {
   const { onClose, children, contentPosition = "center" } = props;

   const handleBackButton = useCallback((): boolean => {
      if (onClose) {
         onClose();
         // Returning true disables the default behavior of the back button:
         return true;
      } else {
         return false;
      }
   }, []);

   useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton);
      return () => {
         BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
      };
   }, [handleBackButton]);

   return (
      <BlurView intensity={80} tint={"dark"} style={styles.dimmer}>
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
      </BlurView>
   );
};

const styles: Styles = StyleSheet.create({
   modalContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flex: 1
   },
   dimmer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
   }
});

export default ModalBackground;
