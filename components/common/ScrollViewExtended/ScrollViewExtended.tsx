import React, { FC, useState } from "react";
import {
   StyleSheet,
   ScrollView,
   ScrollViewProps,
   NativeScrollEvent,
   NativeSyntheticEvent,
   Animated,
   LayoutChangeEvent,
   View
} from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";

export interface ScrollViewExtendedProps extends ScrollViewProps {
   showBottomGradient?: boolean;
   bottomGradientColor?: string;
   /**
    * Triggered when the user scrolls to the bottom and when the user was in the
    * bottom and scrolls upwards scrolledToBottom parameter indicates this.
    */
   onBottomDetector?: (scrolledToBottom: boolean) => void;
   /**
    * Triggered when the content size changes, detects whether or not the scroll is activated
    * when the content is larger than the viewport or not. This information is in the
    * scrollIsActivated parameter.
    */
   onScrollActivatedDetector?: (scrollIsActivated: boolean) => void;
}

export interface ScrollViewExtendedState {
   bottomFadeOpacity: Animated.Value;
   contentHeight: number;
   viewportHeight: number;
}

const ScrollViewExtended: FC<ScrollViewExtendedProps> = props => {
   const {
      showBottomGradient = true,
      bottomGradientColor = "black"
   }: Partial<ScrollViewExtendedProps> = props;

   let scrolledToBottom: boolean;

   const [bottomFadeOpacity] = useState(new Animated.Value(0));
   const [contentHeight, setContentHeight] = useState(0);
   const [viewportHeight, setViewportHeight] = useState(0);

   const isCloseToBottom = ({
      layoutMeasurement,
      contentOffset,
      contentSize
   }: NativeScrollEvent) => {
      const paddingToBottom: number = 1;
      return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
   };

   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (props.onScroll != null) {
         props.onScroll(event);
      }
      const closeToBottom: boolean = isCloseToBottom(event.nativeEvent);
      onBottomDetector(closeToBottom);
      props.onBottomDetector && props.onBottomDetector(closeToBottom);
   };

   const onContentSizeChange = (newWidth: number, newHeight: number) => {
      setContentHeight(newHeight);
      props.onContentSizeChange && props.onContentSizeChange(newWidth, newHeight);
   };

   const onBottomDetector = (scrolledToBottom: boolean) => {
      if (scrolledToBottom === scrolledToBottom) {
         return;
      }

      scrolledToBottom = scrolledToBottom;

      Animated.timing(bottomFadeOpacity, {
         toValue: scrolledToBottom ? 0 : 1,
         duration: 300,
         useNativeDriver: true
      }).start();
   };

   const onLayout = (event: LayoutChangeEvent) => {
      const vh: number = event.nativeEvent.layout.height;
      const scrollingActivated: boolean = contentHeight > vh * 1.05;

      setViewportHeight(vh);

      Animated.timing(bottomFadeOpacity, {
         toValue: scrollingActivated ? 1 : 0,
         duration: 300,
         useNativeDriver: true
      }).start();

      props.onScrollActivatedDetector && props.onScrollActivatedDetector(scrollingActivated);
      props.onLayout && props.onLayout(event);
   };

   return (
      <View style={{ flex: 1 }}>
         <ScrollView
            {...props}
            onScroll={e => onScroll(e)}
            onContentSizeChange={(w, h) => onContentSizeChange(w, h)}
            onLayout={e => onLayout(e)}
            scrollEventThrottle={0}
         >
            {props.children}
         </ScrollView>
         {showBottomGradient && (
            <Animated.View
               style={[styles.bottomGradient, { opacity: bottomFadeOpacity }]}
               pointerEvents="none"
            >
               <LinearGradient
                  locations={[0, 0.5]}
                  colors={[
                     color(bottomGradientColor).alpha(0).string(),
                     color(bottomGradientColor).alpha(1).string()
                  ]}
                  style={{ flex: 1 }}
               />
            </Animated.View>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   bottomGradient: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: 130 // This controls the height of the bottom "fade gradient"
   }
});

export default ScrollViewExtended;
