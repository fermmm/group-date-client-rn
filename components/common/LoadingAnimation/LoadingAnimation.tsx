import React, { FC, useEffect, useRef, useState } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import BasicScreenContainer from "../BasicScreenContainer/BasicScreenContainer";
import TitleMediumText from "../TitleMediumText/TitleMediumText";
import { currentTheme } from "../../../config";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";

interface PropsLoadingAnimation {
   visible?: boolean;
   centeredMethod?: CenteredMethod;
   renderMethod?: RenderMethod;
   style?: StyleProp<ViewStyle>;
   animationStyle?: StyleProp<ViewStyle>;
   /** Shows a cancel button after some time loading, use onTimeoutButtonPress to set the cancel action. */
   enableTimeoutButton?: boolean;
   onTimeoutButtonPress?: (timeWaited: number) => void;
   /** In milliseconds. Default: 5000 */
   timeoutButtonTime?: number;
   timeoutButtonColor?: string;
}

export enum CenteredMethod {
   None,
   Relative,
   Absolute
}

export enum RenderMethod {
   None,
   FullScreen
}

/**
 * To edit the colors of the animation load the animation-loading.json into this tool:
 * https://lottiefiles.com/editor
 */
export const LoadingAnimation: FC<PropsLoadingAnimation> = props => {
   let {
      visible = true,
      centeredMethod,
      renderMethod,
      style,
      animationStyle,
      enableTimeoutButton,
      onTimeoutButtonPress,
      timeoutButtonTime = 4000,
      timeoutButtonColor = "black"
   } = props;

   const [animValue] = useState(new Animated.Value(0));
   const [timeoutButtonVisible, setTimeoutButtonVisible] = useState(false);
   const [timeStamp, setTimestamp] = useState<number>();
   const timeoutId = useRef<number>();

   useEffect(() => {
      animValue.setValue(0);
      Animated.timing(animValue, {
         toValue: 1,
         duration: 1500,
         useNativeDriver: true
      }).start();
   }, [visible]);

   useEffect(() => {
      if (!enableTimeoutButton) {
         return;
      }

      if (!visible) {
         setTimeoutButtonVisible(false);
      }

      setTimestamp(new Date().getTime());
      timeoutId.current = setTimeout(
         () => setTimeoutButtonVisible(true),
         timeoutButtonTime
      ) as unknown as number;

      return () => clearTimeout(timeoutId.current);
   }, [visible]);

   const getWaitedTime = () => {
      return new Date().getTime() - timeStamp;
   };

   let centeringStyle: StyleProp<ViewStyle> = {};

   if (renderMethod === RenderMethod.FullScreen) {
      centeredMethod = CenteredMethod.Absolute;
   }

   if (centeredMethod === CenteredMethod.Relative) {
      centeringStyle = styles.relativePosition;
   }

   if (centeredMethod === CenteredMethod.Absolute) {
      centeringStyle = styles.absolutePosition;
   }

   if (!visible) {
      return null;
   }

   return (
      <>
         {renderMethod === RenderMethod.FullScreen && <BasicScreenContainer />}
         <View style={[styles.containerBase, centeringStyle, style]}>
            <Animated.View style={{ opacity: animValue }}>
               <LottieView
                  source={require("./animation-loading.json")}
                  style={[styles.lottie, animationStyle]}
                  speed={0.75}
                  autoPlay
                  loop
               />
            </Animated.View>
            {timeoutButtonVisible && (
               <ViewTouchable
                  onPress={() => onTimeoutButtonPress(getWaitedTime())}
                  style={styles.cancelButtonContainer}
               >
                  <TitleMediumText
                     style={[
                        styles.buttonText,
                        {
                           color: timeoutButtonColor
                        }
                     ]}
                  >
                     Cancelar
                  </TitleMediumText>
               </ViewTouchable>
            )}
         </View>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   containerBase: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
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
   },
   cancelButtonContainer: {
      overflow: "visible",
      marginTop: -45
   },
   buttonText: {
      fontFamily: currentTheme.font.semiBold,
      textAlign: "center",
      textAlignVertical: "center",
      paddingLeft: 0,
      marginTop: 15,
      marginBottom: 15
   }
});
