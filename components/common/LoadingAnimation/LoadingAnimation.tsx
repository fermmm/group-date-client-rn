import React, { FC, useEffect, useState } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

interface PropsLoadingAnimation {
   visible: boolean;
   centered?: boolean;
   style?: StyleProp<ViewStyle>;
   animationStyle?: StyleProp<ViewStyle>;
}

/**
 * To edit the colors of the animation load the animation-loading.json into this tool:
 * https://lottiefiles.com/editor
 */
export const LoadingAnimation: FC<PropsLoadingAnimation> = ({
   visible,
   centered,
   style,
   animationStyle
}) => {
   if (!visible) {
      return null;
   }

   const [animValue] = useState(new Animated.Value(0));

   useEffect(() => {
      animValue.setValue(0);
      Animated.timing(animValue, {
         toValue: 1,
         duration: 1500,
         useNativeDriver: true
      }).start();
   }, [visible]);

   return (
      <View style={[styles.animationContainer, centered && { height: "100%" }, style]}>
         <Animated.View style={{ opacity: animValue }}>
            <LottieView
               source={require("./animation-loading.json")}
               style={[styles.animation, animationStyle]}
               speed={0.5}
               autoPlay
               loop
            />
         </Animated.View>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   animationContainer: {
      position: "absolute",
      flex: 0,
      width: "40%",
      bottom: 60,
      alignItems: "center",
      justifyContent: "center"
   },
   animation: {
      width: "100%"
   }
});
