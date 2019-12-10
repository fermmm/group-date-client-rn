import React, { Component } from "react";
import { ScrollView, Dimensions, View, NativeSyntheticEvent, NativeScrollEvent, BackHandler } from "react-native";

export interface ScreenStepperProps {
   currentScreen: number;
   screensWidth?: number;
   animated?: boolean;
   swipeEnabled?: boolean;
   /**
    * This triggers when the user press the back button or when 
    * swiping is enabled and the user changes the screen.
    */
   onScreenChange(newScreen: number): void;
}

export class ScreensStepper extends Component<ScreenStepperProps> {
   static defaultProps: Partial<ScreenStepperProps> = {
      screensWidth: Dimensions.get("window").width,
      animated: true,
      swipeEnabled: true
   };
   ref: ScrollView;
   history: number[] = [];
   allowSaveOnHistory: boolean = true;

   constructor(props: ScreenStepperProps) {
      super(props);
      this.handleBackButton = this.handleBackButton.bind(this);
   }

   componentDidMount(): void {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
   }

   componentWillUnmount(): void {
      BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
   }

   render(): JSX.Element {
      return (
         <ScrollView
            horizontal={true}
            pagingEnabled={true}
            scrollEnabled={this.props.swipeEnabled}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onLayout={() => this.scrollToScreen(this.props.currentScreen)}
            onMomentumScrollEnd={(event) => this.onMomentumScrollEnd(event)}
            ref={component => this.ref = component}
         >
            {
               React.Children.map(this.props.children, (child: React.ReactElement) => (
                  <View style={{ width: this.props.screensWidth }}>
                     {child}
                  </View>
               ))
            }
         </ScrollView>
      );
   }

   public componentDidUpdate(prevProps: ScreenStepperProps): void {
      if (prevProps.currentScreen !== this.props.currentScreen) {
         this.scrollToScreen(this.props.currentScreen, this.props.animated);
         this.saveOnBackButtonHistory(prevProps.currentScreen);
      }
   }

   public onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): void {
      const newScreenIndex: number = Math.round(event.nativeEvent.contentOffset.x / this.props.screensWidth);
      // We should remove semi hardcoded this.props.screensWidth and replace it with stuff like this:
      // const newScreenIndex: number = Math.round(Math.ceil(event.nativeEvent.contentOffset.x) / event.nativeEvent.layoutMeasurement.width)

      if (newScreenIndex !== this.props.currentScreen) {
         this.props.onScreenChange(newScreenIndex);
      }
   }

   public scrollToScreen(screenIndex: number, animated: boolean = false): void {
      this.ref.scrollTo({ x: this.props.screensWidth * screenIndex, animated });
   }

   public handleBackButton(): boolean {
      if (this.history.length > 0) {
         this.goBack();
         return true;
      } else {
         return false;
      }
   }

   public saveOnBackButtonHistory(screenIndex: number): void {
      if (!this.allowSaveOnHistory) {
         return;
      }

      // Remove history duplicates:
      if (this.history.indexOf(screenIndex) !== -1) {
         this.history.splice(this.history.indexOf(screenIndex), 1);
      }

      this.history.push(screenIndex);
   }

   public goBack(): void {
      this.allowSaveOnHistory = false;
      this.props.onScreenChange(this.history.pop());
      this.allowSaveOnHistory = true;
   }
}