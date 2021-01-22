import { StyleProp, Animated } from "react-native";

export interface CardAnimation {
   trigger(containerAnimValue: Animated.Value, logoAnimValue: Animated.Value): Promise<void>;
   interpolation(
      containerAnimValue: Animated.Value,
      logoAnimValue: Animated.Value
   ): CardAnimatedStyles;
}

export interface CardAnimatedStyles {
   cardStyle?: StyleProp<unknown>;
   logoStyle?: StyleProp<unknown>;
}
