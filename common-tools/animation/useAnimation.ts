import React, { useEffect, useState } from "react";
import { Animated } from "react-native";

/**
 * Wrapper hook of React Native Animated to have less boilerplate code
 *
 * @param animate Set this boolean to true to animate the value, set it true and then false to reset the animation, also you can use the replay() function returned for that.
 * @example
 *    const { animatedValue, replay } = useAnimation(animate, {
         from: highlightColor,   // In this example we animate a color
         to: color(highlightColor).alpha(0).toString(),
         duration: 300,
         easing: Easing.inOut(Easing.exp),
         useNativeDriver: false  // To animate colors you need useNativeDriver as false
      });
   
      return (
         <Animated.View style={{ backgroundColor: animatedValue }}>{children}</Animated.View>
      );
 */
export function useAnimation(animate: boolean, config: AnimationConfig) {
   const { from, to, valueWhenNotAnimated, ...restOfProps } = config;
   const [animationPosition] = useState(new Animated.Value(0));

   useEffect(() => {
      animationPosition.setValue(0);
      if (!animate) {
         return;
      }

      Animated.timing(animationPosition, {
         ...restOfProps,
         toValue: 1
      }).start();
   }, [animate]);

   let finalValue: Animated.AnimatedInterpolation | Animated.Value;

   if (!animate) {
      if (valueWhenNotAnimated != null) {
         finalValue = valueWhenNotAnimated as any;
      }
   } else {
      finalValue = animationPosition.interpolate({
         inputRange: [0, 1],
         outputRange: [from as string, to as string]
      });
   }

   return {
      animatedValue: finalValue,
      replay: () => animationPosition.setValue(0)
   };
}

export interface AnimationConfig {
   from: number | string;
   to: number | string;
   valueWhenNotAnimated?: number | string;
   useNativeDriver: boolean;
   easing?: ((value: number) => number) | undefined;
   duration?: number | undefined;
   delay?: number | undefined;
}
