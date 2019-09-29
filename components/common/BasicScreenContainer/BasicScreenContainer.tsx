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

      return (
         <>
         <ScrollViewExtended 
            {...this.props}
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
      paddingTop: 10,
      paddingBottom: 20,
   },
   buttonsContainer: {
      marginBottom: 20,
      flexDirection: "row", 
      justifyContent: "space-around"
   }
});
