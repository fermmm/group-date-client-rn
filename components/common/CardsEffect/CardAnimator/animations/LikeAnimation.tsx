import { CardAnimation, CardAnimatedStyles } from "./interface/CardAnimation";
import { Animated, Easing, Dimensions } from "react-native";

export class LikeAnimation implements CardAnimation {
   trigger(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value, onAnimationFinish: Animated.EndCallback = null): void {
      Animated.timing(logoAnimValue, {
         toValue: 1,
         duration: 600,
         easing: Easing.out(Easing.exp),
         useNativeDriver: true
      }).start();

      Animated.timing(containerAnimValue, {
         toValue: 1,
         delay: 450,
         duration: 600,
         easing: Easing.inOut(Easing.ease),
         useNativeDriver: true
      }).start(onAnimationFinish);
   }
   
   interpolation(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): CardAnimatedStyles {
      const rotationValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: ["0deg", "-90deg"]
      });
      const moveValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0, -Dimensions.get("window").width * 0.55]
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
}