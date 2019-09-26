import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ScrollViewExtended, { ScrollViewExtendedProps } from "../ScrollViewExtended/ScrollViewExtended";
import { Button } from "react-native-paper";

export interface BasicScreenProps extends ScrollViewExtendedProps {
   showBackButton?: boolean;
   showContinueButton?: boolean;
   onContinuePress?(): void;
   onBackPress?(): void;
}
export default class BasicScreenContainer extends Component<BasicScreenProps> {
   static defaultProps: Partial<BasicScreenProps> = {
      showBackButton: false,
      showContinueButton: false
   };
   render(): JSX.Element {
      const {showBackButton, showContinueButton}: Partial<BasicScreenProps> = this.props;
      /**
       * TODO: Se esta comiendo un pedazo abajo cuando tiene que scrollear y flex: 1 hace
       * que supuestamente lo arreglaria invisible el contenido, probablemente por que
       * los parents no tienen tamaño
       */
      return (
         <>
         <ScrollViewExtended 
            {...this.props} 
            style={[
               (showBackButton || showContinueButton) ?
                  {height: Dimensions.get("window").height - 120} : {flex: 0}
            ]}
            contentContainerStyle={styles.scrollViewContainer} 
         >
            {this.props.children}
         </ScrollViewExtended>
         {
            (showBackButton || showContinueButton) &&
               <View style={styles.buttonsContainer}>
                  {
                     showBackButton &&
                        <Button 
                           mode="outlined"
                           onPress={() => this.props.onBackPress()}
                        > 
                           Atrás 
                        </Button>
                  }
                  {
                     showContinueButton &&
                        <Button 
                           onPress={() => this.props.onContinuePress()}
                           mode="outlined" 
                        > 
                           Continuar 
                        </Button>
                  }
               </View>
         }
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   scrollViewContainer: {
      padding: 5,
      paddingTop: 25,
      paddingBottom: 60,
   },
   buttonsContainer: {
      height: 40,
      paddingTop: 3,
      flexDirection: "row", 
      justifyContent: "space-around"
   }
});
