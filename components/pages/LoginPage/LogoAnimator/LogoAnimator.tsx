import React, { FC, useState, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface PropsLogoAnimator {
   animate?: boolean;
   enabled?: boolean;
   onAnimationComplete?: () => void;
}

export const LogoAnimator: FC<PropsLogoAnimator> = props => {
   const { children, onAnimationComplete, animate = true, enabled = true } = props;
   const [animValue] = useState(new Animated.Value(0));
   const animation = useRef(
      Animated.timing(animValue, {
         toValue: 1,
         duration: 1000,
         easing: Easing.out(Easing.exp),
         useNativeDriver: true
      })
   );

   useEffect(() => {
      if (animate) {
         animation.current.start(onAnimationComplete);
      }
   }, [animate]);

   // const rotationValue: Animated.AnimatedInterpolation = animValue.interpolate({
   //    inputRange: [0, 1],
   //    outputRange: ["100deg", "0deg"]
   // });

   const scaleValue: Animated.AnimatedInterpolation = animValue.interpolate({
      inputRange: [0, 1],
      // outputRange: [15, 1]
      outputRange: [0.2, 1]
   });

   if (!enabled) {
      <>{children}</>;
   }

   return (
      <Animated.View style={{ transform: [{ scale: scaleValue } /*, { rotate: rotationValue }*/] }}>
         {children}
      </Animated.View>
   );
};
