import React, { Component } from "react";
import { StyleSheet, Animated, View, Easing, Dimensions, StyleProp, ViewStyle } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../../assets/LogoSvg";

export interface LikeDislikeAnimationProps extends Themed {
   // tslint:disable-next-line: no-any
   ref?: any;
}
export interface LikeDislikeAnimationState {
   animating: boolean;
   containerAnimValue: Animated.Value;
   logoAnimValue: Animated.Value;
}

class LikeDislikeAnimation extends Component<LikeDislikeAnimationProps, LikeDislikeAnimationState> {
   static defaultProps: Partial<LikeDislikeAnimationProps> = {};

   state: LikeDislikeAnimationState = {
      animating: false,
      containerAnimValue: new Animated.Value(0),
      logoAnimValue: new Animated.Value(0),
   };

   likeAnimation: boolean;

   render(): JSX.Element {
      const { containerAnimValue, logoAnimValue }: Partial<LikeDislikeAnimationState> = this.state;
      const { animating }: Partial<LikeDislikeAnimationState> = this.state;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      const anims: CardAnimatedStyles = this.likeAnimation ?
         this.likeAnimationInterpolations(containerAnimValue, logoAnimValue)
      :
         this.dislikeAnimationInterpolations(containerAnimValue, logoAnimValue);

      return (
         <Animated.View style={[{ flex: 1 }, anims.cardStyle]}>
            {this.props.children}
            {
               animating && 
                  <Animated.View style={[styles.logoAnimationContainer, anims.logoStyle]}>
                     <View style={styles.logoContainer}>
                        <LogoSvg color={colors.primary2} />
                     </View>
                  </Animated.View>
            }
         </Animated.View>
      );
   }

   animate(likeAnimation: boolean, onComplete: () => void): void {
      this.setState({animating: true});
      this.likeAnimation = likeAnimation;
      let triggerAnimation: (onFinish: () => void) => void;

      if (likeAnimation) {
         triggerAnimation = (fc) => this.triggerLikeAnimation(fc);
      } else {
         triggerAnimation = (fc) => this.triggerDislikeAnimation(fc);
      }

      triggerAnimation(() => {      
         this.setState({
            animating: false,
            containerAnimValue: new Animated.Value(0),
            logoAnimValue: new Animated.Value(0),
         });
         
         if (onComplete != null) {
            onComplete();
         }
      });
   }

   triggerLikeAnimation(onAnimationFinish: Animated.EndCallback = null): void {
      Animated.timing(this.state.logoAnimValue, {
         toValue: 1,
         duration: 600,
         easing: Easing.out(Easing.exp),
         useNativeDriver: true
      }).start();

      Animated.timing(this.state.containerAnimValue, {
         toValue: 1,
         delay: 340,
         duration: 300,
         easing: Easing.in(Easing.sin),
         useNativeDriver: true
      }).start(onAnimationFinish);
   }

   triggerDislikeAnimation(onAnimationFinish: Animated.EndCallback = null): void {
      Animated.timing(this.state.logoAnimValue, {
         toValue: 1,
         duration: 300,
         easing: Easing.out(Easing.exp),
         useNativeDriver: true
      }).start();

      Animated.timing(this.state.containerAnimValue, {
         toValue: 1,
         delay: 0,
         duration: 300,
         easing: Easing.in(Easing.sin),
         useNativeDriver: true
      }).start(onAnimationFinish);
   }

   likeAnimationInterpolations(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): CardAnimatedStyles {
      const rotationValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: ["0deg", "-80deg"]
      });
      const moveValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0, -Dimensions.get("window").width * 0.55]
      });
      const opacityValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, .65, 1],
         outputRange: [1, 1, 0]
      });
      const logoMoveValue: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [Dimensions.get("window").height, 0]
      });
      const logoScale: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0.1, 1]
      });

      return { 
         cardStyle: {
            opacity: opacityValue,
            transform: [
               { translateX: moveValue },
               { rotateY: rotationValue },
            ]
         },
         logoStyle: {
            transform: [
               { translateY: logoMoveValue },
               { scale: logoScale }
            ]
         }
      };
   }

   dislikeAnimationInterpolations(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): CardAnimatedStyles {
      const moveValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0, Dimensions.get("window").height * 0.85]
      });
      const opacityValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 0.7],
         outputRange: [1, 0]
      });
      const logoMoveValue: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [Dimensions.get("window").height, 0]
      });
      const logoOpacity: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0, 0]
      });

      return { 
         cardStyle: {
            opacity: opacityValue,
            transform: [
               { translateY: moveValue },
            ]
         },
         logoStyle: {
            opacity: logoOpacity,
            transform: [
               { translateY: logoMoveValue },
            ]
         }
      };
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
      width: "55%",
      marginBottom: 150
   },
});

export interface CardAnimatedStyles {
   cardStyle: StyleProp<unknown>; 
   logoStyle: StyleProp<unknown>;
}

export default withTheme(LikeDislikeAnimation);
