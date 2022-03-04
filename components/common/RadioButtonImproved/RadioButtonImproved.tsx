import React, { FC, useState } from "react";
import { StyleSheet, View, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { RadioButton } from "react-native-paper";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";

export interface RadioButtonImprovedProps {
   checked?: boolean;
   style?: StyleProp<ViewStyle>;
   onPress(): void;
   iconElement?(checked: boolean): JSX.Element;
}

const RadioButtonImproved: FC<RadioButtonImprovedProps> = props => {
   const [margin, setMargin] = useState<number>(null);
   const { onPress, style, iconElement, checked = false, children } = props;

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
      const height: number = event.nativeEvent.layout.height;
      if (margin == null) {
         setMargin(translateBetweenRanges(height, 20, 64, 0, 9));
      }
   };

   return (
      <ViewTouchable onPress={() => onPress()} style={[style, styles.mainContainer]}>
         <>
            <View style={{ marginRight: 15 }}>
               {iconElement != null ? (
                  iconElement(checked)
               ) : (
                  <RadioButton.Android value={""} status={checked ? "checked" : "unchecked"} />
               )}
            </View>
            <View style={styles.childrenContainer} onLayout={measureView}>
               {children}
            </View>
         </>
      </ViewTouchable>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 5,
      paddingRight: 13,
      paddingTop: 4,
      paddingBottom: 4
   },
   childrenContainer: {
      flexShrink: 1
   }
});

export default RadioButtonImproved;
