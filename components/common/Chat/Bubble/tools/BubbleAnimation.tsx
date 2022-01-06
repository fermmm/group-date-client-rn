import color from "color";
import React, { FC } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { useAnimation } from "../../../../../common-tools/animation/useAnimation";

interface PropsBubbleAnimation {
   animateHighlight: boolean;
   highlightColor: string;
   style?: StyleProp<ViewStyle> | undefined;
}

const BubbleAnimation: FC<PropsBubbleAnimation> = props => {
   const { animateHighlight, highlightColor, children, style } = props;
   const { animatedValue, replay } = useAnimation(animateHighlight, {
      from: highlightColor,
      to: color(highlightColor).alpha(0).toString(),
      duration: 1000,
      useNativeDriver: false
   });

   return (
      <Animated.View style={[{ backgroundColor: animatedValue }, style]}>{children}</Animated.View>
   );
};

export default BubbleAnimation;
