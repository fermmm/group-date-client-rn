import React, { FC, useState, useEffect } from "react";
import { Animated, Easing } from "react-native";

interface PropsLogoAnimator {
   onAnimationComplete?: () => void;
}

export const LogoAnimator: FC<PropsLogoAnimator> = ({ children, onAnimationComplete }) => {
   const [animValue] = useState(new Animated.Value(0));

   useEffect(
      () =>
         Animated.timing(animValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true
         }).start(onAnimationComplete),
      []
   );

   const rotationValue: Animated.AnimatedInterpolation = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["100deg", "0deg"]
   });

   const scaleValue: Animated.AnimatedInterpolation = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 1]
   });

   return (
      <Animated.View style={{ transform: [{ scale: scaleValue }, { rotate: rotationValue }] }}>
         {children}
      </Animated.View>
   );
};
