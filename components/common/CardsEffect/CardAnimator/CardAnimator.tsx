import React, { Component } from "react";
import { StyleSheet, Animated, View } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../../assets/LogoSvg";
import color from "color";
import { currentTheme } from "../../../../config";
import { CardAnimation, CardAnimatedStyles } from "./animations/interface/CardAnimation";

export interface CardAnimatorProps extends Themed {
   // tslint:disable-next-line: no-any
   ref?: any;
}
export interface CardAnimatorState {
   containerAnimValue: Animated.Value;
   logoAnimValue: Animated.Value;
   cardAnimation: CardAnimation;
}

/**
 * This component performs the animations on the child
 */
class CardAnimator extends Component<CardAnimatorProps, CardAnimatorState> {
   static defaultProps: Partial<CardAnimatorProps> = {};

   state: CardAnimatorState = {
      containerAnimValue: new Animated.Value(0),
      logoAnimValue: new Animated.Value(0),
      cardAnimation: null,
   };
   animStyles: CardAnimatedStyles;

   render(): React.ReactNode {
      const { containerAnimValue, logoAnimValue, cardAnimation }: Partial<CardAnimatorState> = this.state;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      if (cardAnimation != null) {
         this.animStyles = cardAnimation.interpolation(containerAnimValue, logoAnimValue);
      }

      if (this.animStyles == null) {
         this.animStyles = {cardStyle: null, logoStyle: null};
      }

      return (
         <Animated.View style={[{ flex: 1 }, this.animStyles.cardStyle]}>
            {this.props.children}
            {
               this.animStyles.logoStyle != null &&
                  <Animated.View style={[styles.logoAnimationContainer, this.animStyles.logoStyle]}>
                     <View style={styles.logoContainer}>
                        <LogoSvg color={colors.primary2} style={styles.logo}/>
                     </View>
                  </Animated.View>
            }      
         </Animated.View>
      );
   }

   animate(cardAnimation: CardAnimation, onComplete: () => void = null): void {
      this.setState({cardAnimation});

      cardAnimation.trigger(
         this.state.containerAnimValue, 
         this.state.logoAnimValue, 
         () => {      
            this.setState({
               containerAnimValue: new Animated.Value(0),
               logoAnimValue: new Animated.Value(0),
               cardAnimation: null
            });
            
            if (onComplete != null) {
               onComplete();
            }
      });
   }
}

const styles: Styles = StyleSheet.create({
   logoAnimationContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
   },
   logoContainer: {
      width: "65%",
      marginBottom: 150,
      backgroundColor: color(currentTheme.colors.primary2).alpha(0.07).toString(),
      padding: 30,
      borderRadius: 9999
   },
   logo: {
      paddingTop: 16
   }
});

export default withTheme(CardAnimator);
