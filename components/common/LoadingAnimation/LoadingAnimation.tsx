import React, { FC, useEffect, useState } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

interface PropsLoadingAnimation {
   visible: boolean;
   centeredMethod?: CenteredMethod;
   style?: StyleProp<ViewStyle>;
   animationStyle?: StyleProp<ViewStyle>;
}

export enum CenteredMethod {
   None,
   Relative,
   Absolute
}

/**
 * To edit the colors of the animation load the animation-loading.json into this tool:
 * https://lottiefiles.com/editor
 */
export const LoadingAnimation: FC<PropsLoadingAnimation> = ({
   visible,
   centeredMethod,
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

   let centeringStyle: StyleProp<ViewStyle> = {};

   if (centeredMethod === CenteredMethod.Relative) {
      centeringStyle = styles.relativePosition;
   }

   if (centeredMethod === CenteredMethod.Absolute) {
      centeringStyle = styles.absolutePosition;
   }

   return (
      <View style={[styles.containerBase, centeringStyle, style]}>
         <Animated.View style={{ opacity: animValue }}>
            <LottieView
               source={require("./animation-loading.json")}
               style={[styles.lottie, animationStyle]}
               speed={0.5}
               autoPlay
               loop
            />
         </Animated.View>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   containerBase: {
      alignItems: "center",
      justifyContent: "center"
   },
   relativePosition: {
      position: "relative",
      width: "100%"
   },
   absolutePosition: {
      position: "absolute",
      width: "100%",
      height: "100%"
   },
   lottie: {
      width: "40%"
   }
});
