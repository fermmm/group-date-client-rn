import { CardAnimation, CardAnimatedStyles } from "./interface/CardAnimation";
import { Animated, Easing, Dimensions, Platform } from "react-native";

export class LikeAnimation implements CardAnimation {
   async trigger(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value,
      shadowAnimValue: Animated.Value
   ): Promise<void> {
      return new Promise(resolve => {
         Animated.timing(logoAnimValue, {
            toValue: 1,
            duration: 350,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true
         }).start();

         Animated.timing(shadowAnimValue, {
            toValue: 1,
            delay: 350,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
         }).start(() => resolve());

         Animated.timing(containerAnimValue, {
            toValue: 1,
            delay: 350,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
         }).start();
      });
   }

   interpolation(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value,
      shadowAnimValue: Animated.Value
   ): CardAnimatedStyles {
      const rotationValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: ["0deg", Platform.OS !== "ios" ? "-90deg" : "0deg"] // It seems 3D rotation cannot be animated in IOS
      });
      const moveValue: Animated.AnimatedInterpolation = containerAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [
            0,
            Platform.OS !== "ios"
               ? -Dimensions.get("window").width * 0.55
               : -Dimensions.get("window").width // If there is no 3D rotation because of IOS then the card moves away from the screen completely
         ]
      });
      const logoMoveValue: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [Dimensions.get("window").height, 0]
      });
      // const logoScale: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
      //    inputRange: [0, 1],
      //    outputRange: [1, 1]
      // });
      const shadowOpacityValue: Animated.AnimatedInterpolation = shadowAnimValue.interpolate({
         inputRange: [0, 1],
         outputRange: [1, 0]
      });

      return {
         cardStyle: {
            transform: [{ translateX: moveValue }, { rotateY: rotationValue }]
         },
         logoStyle: {
            transform: [{ translateY: logoMoveValue } /*, { scale: logoScale }*/]
         },
         shadowStyle: {
            opacity: shadowOpacityValue
         }
      };
   }
}
