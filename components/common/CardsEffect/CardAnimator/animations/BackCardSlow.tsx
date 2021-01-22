import { CardAnimation, CardAnimatedStyles } from "./interface/CardAnimation";
import { Animated, Easing } from "react-native";

export class BackCardSlowAnimation implements CardAnimation {
   async trigger(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): Promise<void> {
      return new Promise(resolve => {
         Animated.timing(containerAnimValue, {
            toValue: 1,
            delay: 600,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
         }).start(() => resolve());
      });
   }

   interpolation(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value
   ): CardAnimatedStyles {
      const scaleValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [0.95, 1]
      });

      return {
         cardStyle: {
            transform: [{ scale: scaleValue }]
         }
      };
   }
}
