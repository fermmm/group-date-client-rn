import React, { useEffect, useState, useRef, FC } from "react";
import { View, Dimensions, AppState } from "react-native";

interface DimensionData {
   rectTop: number;
   rectBottom: number;
   rectWidth: number;
}

interface PropsVisibilitySensor {
   /** Function that is triggered when component enters the viewport */
   onVisibilityChange: (visible: boolean) => void;
   /** Function that is triggered when component dismounts or app goes to background mode or closed */
   onDismount?: () => void;
}

const VisibilitySensor: FC<PropsVisibilitySensor> = props => {
   const myView = useRef<View>(null);
   const [lastValue, setLastValue] = useState<boolean>(null);
   const [dimensions, setDimensions] = useState<DimensionData>({
      rectTop: 0,
      rectBottom: 0,
      rectWidth: 0
   });
   const [appFocused, setAppFocused] = useState<boolean>(true);

   let interval: any = null;

   useEffect(() => {
      startWatching();
      isInViewPort();
      return stopWatching;
   }, [dimensions.rectTop, dimensions.rectBottom, dimensions.rectWidth, appFocused]);

   useEffect(
      () => () => {
         props.onVisibilityChange(false);
         props.onDismount?.();
      },
      []
   );

   useEffect(() => {
      AppState.addEventListener("change", handleAppStateChange);
      return () => {
         AppState.removeEventListener("change", handleAppStateChange);
      };
   }, []);

   const handleAppStateChange = nextAppState => {
      const focused = !nextAppState.match(/inactive|background/);
      setAppFocused(focused);
      if (!focused) {
         props.onDismount?.();
      }
   };

   const startWatching = () => {
      if (interval) {
         return;
      }

      interval = setInterval(() => {
         if (!myView || !myView.current) {
            return;
         }

         myView.current.measure(
            async (
               _x: number,
               _y: number,
               width: number,
               height: number,
               pageX: number,
               pageY: number
            ) => {
               setDimensions({
                  rectTop: pageY,
                  rectBottom: pageY + height,
                  rectWidth: pageX + width
               });
            }
         );
      }, 300);
   };

   const stopWatching = () => {
      interval = clearInterval(interval);
   };

   const isInViewPort = () => {
      const window = Dimensions.get("window");
      const isVisible =
         dimensions.rectBottom != 0 &&
         dimensions.rectBottom >= 0 &&
         dimensions.rectTop <= window.height &&
         dimensions.rectWidth > 0 &&
         dimensions.rectWidth <= window.width &&
         appFocused;

      if (lastValue !== isVisible) {
         setLastValue(isVisible);
         props.onVisibilityChange(isVisible);
      }
   };

   return (
      <View collapsable={false} ref={myView} {...props}>
         {props.children}
         <View />
      </View>
   );
};

export default VisibilitySensor;
