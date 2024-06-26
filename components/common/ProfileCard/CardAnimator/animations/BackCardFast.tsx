import { CardAnimation, CardAnimatedStyles } from "./interface/CardAnimation";
import { Animated, Easing } from "react-native";

export class BackCardFastAnimation implements CardAnimation {
   trigger(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value, onAnimationFinish: Animated.EndCallback = null): void {
      Animated.timing(containerAnimValue, {
         toValue: 1,
         delay: 0,
         duration: 600,
         easing: Easing.inOut(Easing.ease),
         useNativeDriver: true
      }).start(onAnimationFinish);
   }
   
   interpolation(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): CardAnimatedStyles {
      const scaleValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0.94, 1]
      });

      return { 
         cardStyle: {
            transform: [
               { scale: scaleValue },
            ]
         }
      };
   }
}