import React, { Component } from "react";
import { StyleSheet, Animated, View, Easing, Dimensions, StyleProp, ViewStyle } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../../assets/LogoSvg";
import color from "color";
import { currentTheme } from "../../../../config";
import { CardAnimation, CardAnimatedStyles } from "./animations/interface/CardAnimation";

export interface LikeDislikeAnimationProps extends Themed {
   // tslint:disable-next-line: no-any
   ref?: any;
}
export interface LikeDislikeAnimationState {
   containerAnimValue: Animated.Value;
   logoAnimValue: Animated.Value;
   cardAnimation: CardAnimation;
}

class LikeDislikeAnimation extends Component<LikeDislikeAnimationProps, LikeDislikeAnimationState> {
   static defaultProps: Partial<LikeDislikeAnimationProps> = {};

   state: LikeDislikeAnimationState = {
      containerAnimValue: new Animated.Value(0),
      logoAnimValue: new Animated.Value(0),
      cardAnimation: null,
   };

   render(): React.ReactNode {
      const { containerAnimValue, logoAnimValue, cardAnimation }: Partial<LikeDislikeAnimationState> = this.state;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      let animStyles: CardAnimatedStyles = null;

      if (cardAnimation == null) {
         animStyles = {cardStyle: null, logoStyle: null};
      } else {
         animStyles = cardAnimation.interpolation(containerAnimValue, logoAnimValue);
      }

      return (
         <Animated.View style={[{ flex: 1 }, animStyles.cardStyle]}>
            {this.props.children}
            {
               animStyles.logoStyle != null &&
                  <Animated.View style={[styles.logoAnimationContainer, animStyles.logoStyle]}>
                     <View style={styles.logoContainer}>
                        <LogoSvg color={colors.primary2} style={styles.logo}/>
                     </View>
                  </Animated.View>
            }      
         </Animated.View>
      );
   }

   animate(cardAnimation: CardAnimation, onComplete: () => void): void {
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
      backgroundColor: color(currentTheme.colors.primary2).alpha(0.05).toString(),
      padding: 30,
      borderRadius: 9999
   },
   logo: {
      paddingTop: 16
   }
});

export default withTheme(LikeDislikeAnimation);
