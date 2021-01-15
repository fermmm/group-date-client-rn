import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface DotsIndicatorProps {
   activeDot: number;
   totalDots: number;
}

const DotsIndicator: FC<DotsIndicatorProps> = props => {
   const { activeDot, totalDots }: Partial<DotsIndicatorProps> = props;

   return (
      <View style={styles.mainContainer}>
         {Array(totalDots)
            .fill(1)
            .map((item, i) => (
               <View style={[styles.dot, i === activeDot && styles.activeDot]} key={i} />
            ))}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      position: "absolute",
      width: "100%",
      height: 30,
      bottom: "8%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row"
   },
   dot: {
      width: 7,
      height: 7,
      backgroundColor: "white",
      borderRadius: 999,
      marginLeft: 4,
      marginRight: 4,
      opacity: 0.7
   },
   activeDot: {
      width: 10,
      height: 10,
      opacity: 1
   }
});

export default DotsIndicator;
