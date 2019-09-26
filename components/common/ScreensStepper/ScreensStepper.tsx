import React, { Component, Ref } from "react";
import { ScrollView, Dimensions, View } from "react-native";

export interface ScreenStepperProps {
   currentScreen: number;
   screensWidth?: number;
}
export interface ScreenStepperState { }

export class ScreensStepper extends Component<ScreenStepperProps, ScreenStepperState> {
   static defaultProps: Partial<ScreenStepperProps> = {
      screensWidth: Dimensions.get("window").width
   };
   ref: ScrollView;

   render(): JSX.Element {
      return (
         <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ref={component => this.ref = component}
         >
            {
               React.Children.map(this.props.children, (child: React.ReactElement) =>
                  <View style={{ width: this.props.screensWidth }}>
                     {child}
                  </View>
               )
            }
         </ScrollView>
      );
   }

   public componentDidUpdate(prevProps: ScreenStepperProps, prevState: ScreenStepperState): void {
      if (prevProps.currentScreen !== this.props.currentScreen) {
         this.ref.scrollTo({x: this.props.screensWidth * this.props.currentScreen});
      }
   }

   public componentDidMount(): void {
      this.ref.scrollTo({x: this.props.screensWidth * this.props.currentScreen}, null, false);
   }
}