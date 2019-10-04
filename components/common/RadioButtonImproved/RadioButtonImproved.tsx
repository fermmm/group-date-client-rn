import React, { Component } from "react";
import { StyleSheet, View, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { RadioButton, TouchableRipple } from "react-native-paper";

export interface RadioButtonImprovedProps {
   checked: boolean;
   style?: StyleProp<ViewStyle>;
   onPress(): void;
   iconElement?(checked: boolean): JSX.Element;
}

interface RaddioButtonImprovedState {
   marginBottom: number;
}

class RaddioButtonImproved extends Component<RadioButtonImprovedProps, RaddioButtonImprovedState> {
   state: RaddioButtonImprovedState = {
      marginBottom: null
   };

   render(): JSX.Element {
      const { marginBottom }: Partial<RaddioButtonImprovedState> = this.state;

      return (
         <TouchableRipple onPress={() => this.props.onPress()}>
            <View pointerEvents={"none"} style={[this.props.style, styles.mainContainer, marginBottom != null && {marginBottom}]}>
               <View>
                  {
                     this.props.iconElement != null ?
                        this.props.iconElement(this.props.checked)
                     :
                        <RadioButton value={""} status={this.props.checked ? "checked" : "unchecked"}/>
                  }
               </View>
               <View style={styles.childrenContainer} onLayout={e => this.measureView(e)} >
                  {this.props.children}
               </View>
            </View>
         </TouchableRipple>
      );
   }

   measureView(event: LayoutChangeEvent): void {
      const responseHeight: number = event.nativeEvent.layout.height;
      if (this.state.marginBottom == null) {
         this.setState({marginBottom: this.translateBetweenRanges(responseHeight, 20, 64, 0, 30)});
      }
   }

   translateBetweenRanges(valueToTranslate: number, range1Min: number, range1Max: number, range2Min: number, range2Max: number): number {
      return (((valueToTranslate - range1Min) * (range2Max - range2Min)) / (range1Max - range1Min)) + range2Min;
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flexDirection: "row", 
      alignItems: "center"
   },
   childrenContainer: {
      flex: 1
   }
});

export default RaddioButtonImproved;