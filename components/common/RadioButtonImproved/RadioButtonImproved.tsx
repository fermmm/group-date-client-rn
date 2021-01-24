import React, { FC, useState } from "react";
import { StyleSheet, View, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { RadioButton, TouchableRipple } from "react-native-paper";

export interface RadioButtonImprovedProps {
   checked: boolean;
   style?: StyleProp<ViewStyle>;
   onPress(): void;
   iconElement?(checked: boolean): JSX.Element;
}

const RadioButtonImproved: FC<RadioButtonImprovedProps> = props => {
   const [margin, setMargin] = useState<number>(null);

   const translateBetweenRanges = (
      valueToTranslate: number,
      range1Min: number,
      range1Max: number,
      range2Min: number,
      range2Max: number
   ): number => {
      return (
         ((valueToTranslate - range1Min) * (range2Max - range2Min)) / (range1Max - range1Min) +
         range2Min
      );
   };

   const measureView = (event: LayoutChangeEvent) => {
      const responseHeight: number = event.nativeEvent.layout.height;
      if (margin == null) {
         setMargin(translateBetweenRanges(responseHeight, 20, 64, 0, 9));
      }
   };

   return (
      <TouchableRipple onPress={() => props.onPress()}>
         <View
            pointerEvents={"none"}
            style={[
               props.style,
               styles.mainContainer,
               margin != null && {
                  marginBottom: margin,
                  marginTop: margin
               }
            ]}
         >
            <View>
               {props.iconElement != null ? (
                  props.iconElement(props.checked)
               ) : (
                  <RadioButton value={""} status={props.checked ? "checked" : "unchecked"} />
               )}
            </View>
            <View style={styles.childrenContainer} onLayout={e => measureView(e)}>
               {props.children}
            </View>
         </View>
      </TouchableRipple>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flexDirection: "row",
      alignItems: "center"
   },
   childrenContainer: {
      flex: 1
   }
});

export default RadioButtonImproved;
