import React, { FC } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { useAnimation } from "react-native-animation-hooks";

interface PropsBubbleAnimation {
   animateHighlight: boolean;
   highlightColor: string;
   style?: StyleProp<ViewStyle> | undefined;
}

// TODO: Fix highlighting the same message 2 times doesn't work
const BubbleAnimation: FC<PropsBubbleAnimation> = props => {
   const { animateHighlight, highlightColor, children, style } = props;

   const backgroundColorAnimated = useAnimation({
      type: "timing",
      initialValue: 1,
      toValue: animateHighlight ? 1 : 0,
      duration: 1000,
      delay: 1000,
      useNativeDriver: false
   });

   return (
      <Animated.View
         style={[
            {
               backgroundColor: !animateHighlight
                  ? "transparent"
                  : backgroundColorAnimated.interpolate({
                       inputRange: [0, 1],
                       outputRange: [highlightColor, "transparent"]
                    })
            },
            style
         ]}
      >
         {children}
      </Animated.View>
   );
};

export default BubbleAnimation;
