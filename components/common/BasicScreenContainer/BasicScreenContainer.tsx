import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ScrollViewExtended, { ScrollViewExtendedProps } from "../ScrollViewExtended/ScrollViewExtended";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { currentTheme } from "../../../config";
import color from "color";

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
         <LinearGradient 
            style={{flex: 1}}
            locations={[0.7, 1]}
            colors={[
               color(currentTheme.colors.background).string(),
               color(currentTheme.colors.backgroundBottomGradient).alpha(1).string(),
            ]}
         >
            <ScrollViewExtended 
               showBottomGradient
               bottomGradientColor={currentTheme.colors.background}
               {...this.props}
               contentContainerStyle={[styles.scrollViewContainer, (showBackButton || showContinueButton) && {paddingBottom: 70}]} 
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
                              color={currentTheme.colors.accent2}
                              style={styles.button}
                           > 
                              Atrás 
                           </Button>
                     }
                     {
                        showContinueButton &&
                           <Button 
                              onPress={() => this.props.onContinuePress()}
                              mode="outlined"
                              color={currentTheme.colors.accent2}
                              style={styles.button}
                           > 
                              Continuar 
                           </Button>
                     }
                  </View>
            }
         </LinearGradient>
      );
   }
}

const styles: Styles = StyleSheet.create({
   scrollViewContainer: {
      padding: 5,
      paddingTop: 16,
      paddingBottom: 20,
   },
   buttonsContainer: {
      flex: 1,
      width: "100%",
      position: "absolute",
      marginBottom: 20,
      flexDirection: "row", 
      justifyContent: "space-around",
      bottom: 0,
   },
   button: {
      borderColor: currentTheme.colors.accent2
   }
});
