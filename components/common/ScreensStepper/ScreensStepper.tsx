import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import {
   ScrollView,
   Dimensions,
   View,
   NativeSyntheticEvent,
   NativeScrollEvent,
   BackHandler
} from "react-native";

export interface ScreenStepperProps {
   currentScreen: number;
   screensWidth?: number;
   animated?: boolean;
   swipeEnabled?: boolean;
   /**
    * This triggers when the user press the back button or when
    * swiping is enabled and the user changes the screen.
    */
   onScreenChange: (newScreen: number) => void;
}

export const ScreensStepper: FC<ScreenStepperProps> = props => {
   const {
      screensWidth = Dimensions.get("window").width,
      animated = true,
      swipeEnabled = true,
      currentScreen,
      onScreenChange,
      children
   } = props;

   const ref = useRef<ScrollView>();
   const history = useRef<number[]>([]);
   const dontSaveHistoryNextTime = useRef(false);

   useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton);
      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
   }, [onScreenChange]);

   useEffect(() => {
      scrollToScreen(currentScreen, animated);
      addCurrentStepToHistory(currentScreen);
   }, [currentScreen]);

   /**
    * This is triggered when the user finishes swiping to another screen
    */
   const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
      const newScreenIndex: number = Math.round(event.nativeEvent.contentOffset.x / screensWidth);
      if (newScreenIndex !== currentScreen) {
         onScreenChange(newScreenIndex);
      }
   };

   const scrollToScreen = (screenIndex: number, animated: boolean = false): void => {
      ref.current.scrollTo({ x: screensWidth * screenIndex, animated });
   };

   const handleBackButton = useCallback((): boolean => {
      const canGoBack = goBack();
      // Returning true here disables the default behavior of the back button:
      return canGoBack;
   }, []);

   const addCurrentStepToHistory = (screenIndex: number): void => {
      if (dontSaveHistoryNextTime.current) {
         dontSaveHistoryNextTime.current = false;
         return;
      }

      // Remove history duplicates:
      if (history.current.indexOf(screenIndex) !== -1) {
         history.current.splice(history.current.indexOf(screenIndex), 1);
      }

      history.current.push(screenIndex);
   };

   const removeLastStepFromHistory = () => {
      history.current.pop();
   };

   /*
    * The return value is true or false whether or not is possible to go back to a previous step
    */
   const goBack = (): boolean => {
      if (historyContainsItemsToGoBack()) {
         dontSaveHistoryNextTime.current = true; // Dont register the way back as somewhere to go back
         removeLastStepFromHistory();
         onScreenChange(history.current[history.current.length - 1]);
         return true;
      } else {
         return false;
      }
   };

   /*
    * The history contains also the current step, so we have somewhere to go back when we have
    * more than 1 element on the history.
    */
   const historyContainsItemsToGoBack = () => {
      return history.current.length > 1;
   };

   const handleOnLayout = useCallback(
      () => ref.current.scrollTo({ x: screensWidth * currentScreen, animated }),
      [currentScreen, animated, screensWidth, ref.current]
   );

   const handleOnMomentumScrollEnd = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
         const newScreenIndex: number = Math.round(
            event.nativeEvent.contentOffset.x / screensWidth
         );
         if (newScreenIndex !== currentScreen) {
            onScreenChange(newScreenIndex);
         }
      },
      [screensWidth, currentScreen, onScreenChange]
   );

   return (
      <ScrollView
         horizontal={true}
         pagingEnabled={true}
         scrollEnabled={swipeEnabled}
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         onLayout={handleOnLayout}
         onMomentumScrollEnd={handleOnMomentumScrollEnd}
         ref={ref}
      >
         {React.Children.map(children, (child: React.ReactElement) => (
            <View style={{ width: screensWidth }}>{child}</View>
         ))}
      </ScrollView>
   );
};

export default React.memo(ScreensStepper);
