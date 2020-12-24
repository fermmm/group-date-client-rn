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
   ToWindow,
   ToContainer
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

   if (centeredMethod === CenteredMethod.ToWindow) {
      centeringStyle = styles.centerToWindow;
   }

   if (centeredMethod === CenteredMethod.ToContainer) {
      centeringStyle = styles.centerToContainer;
   }

   return (
      <View style={[styles.animationContainer, centeringStyle, style]}>
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
   animationContainer: {
      position: "absolute",
      flex: 0,
      alignItems: "center",
      justifyContent: "center"
   },
   centerToWindow: {
      width: Dimensions.get("window").width,
      height: "100%"
   },
   centerToContainer: {
      width: "100%",
      height: "100%"
   },
   lottie: {
      width: "40%"
   }
});
