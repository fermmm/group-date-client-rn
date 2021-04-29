import { CardAnimation, CardAnimatedStyles } from "./interface/CardAnimation";
import { Animated, Easing, Dimensions } from "react-native";

export class DislikeAnimation implements CardAnimation {
   async trigger(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value,
      shadowAnimValue: Animated.Value
   ): Promise<void> {
      return new Promise(resolve => {
         Animated.timing(logoAnimValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true
         }).start();

         Animated.timing(shadowAnimValue, {
            toValue: 1,
            delay: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
         }).start(() => resolve());

         Animated.timing(containerAnimValue, {
            toValue: 1,
            delay: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true
         }).start(() => resolve());
      });
   }

   interpolation(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value,
      shadowAnimValue: Animated.Value
   ): CardAnimatedStyles {
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
      const shadowOpacityValue: Animated.AnimatedInterpolation = shadowAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [1, 0]
      });

      return {
         cardStyle: {
            opacity: opacityValue,
            transform: [{ translateY: moveValue }]
         },
         logoStyle: {
            opacity: logoOpacity,
            transform: [{ translateY: logoMoveValue }]
         },
         shadowStyle: {
            opacity: shadowOpacityValue
         }
      };
   }
}
