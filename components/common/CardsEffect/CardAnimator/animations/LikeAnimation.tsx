import { CardAnimation, CardAnimatedStyles } from "./interface/CardAnimation";
import { Animated, Easing, Dimensions } from "react-native";

export class LikeAnimation implements CardAnimation {
   async trigger(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): Promise<void> {
      return new Promise(resolve => {
         Animated.timing(logoAnimValue, {
            toValue: 1,
            duration: 350,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true
         }).start();

         Animated.timing(containerAnimValue, {
            toValue: 1,
            delay: 350,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
         }).start(() => resolve());
      });
   }

   interpolation(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value
   ): CardAnimatedStyles {
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
      // const logoScale: Animated.AnimatedInterpolation = logoAnimValue.interpolate({
      //    inputRange: [0, 1],
      //    outputRange: [1, 1]
      // });

      return {
         cardStyle: {
            transform: [{ translateX: moveValue }, { rotateY: rotationValue }]
         },
         logoStyle: {
            transform: [{ translateY: logoMoveValue } /*, { scale: logoScale }*/]
         }
      };
   }
}
