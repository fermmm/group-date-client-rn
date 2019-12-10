import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface DotsIndicatorProps extends Themed {
   activeDot: number;
   totalDots: number;
}

class DotsIndicator extends Component<DotsIndicatorProps> {
   render(): JSX.Element {
      const { activeDot, totalDots }: Partial<DotsIndicatorProps> = this.props;

      return (
         <View style={styles.mainContainer}>
            {
               Array(totalDots).fill(1).map((item, i) => 
                  <View style={[styles.dot, i === activeDot && styles.activeDot]} key={i}/>
               )
            }
         </View>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      position: "absolute",
      width: "100%",
      height: 30,
      bottom: "4%",
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

export default withTheme(DotsIndicator);