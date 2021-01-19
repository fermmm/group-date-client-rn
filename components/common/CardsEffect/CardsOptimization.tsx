import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface CardsOptimizationProps {
   currentCard: number;
   children?: React.ReactNode[] | React.ReactNode;
}
export interface CardsOptimizationState {
   childA: React.ReactNode;
   childB: React.ReactNode;
   centerChild: React.ReactNode;
}

/**
 * Renders only 2 of the children. currentCard prop is the child index to render, the next one
 * will also be rendered to be able to implement animations.
 */
class CardsOptimization extends Component<CardsOptimizationProps, CardsOptimizationState> {
   state: CardsOptimizationState = {
      childA: null,
      childB: null,
      centerChild: null
   };

   componentDidMount(): void {
      const { currentCard }: Partial<CardsOptimizationProps> = this.props;

      const children: React.ReactNode[] = React.Children.toArray(this.props.children);
      const nextChildren: React.ReactNode =
         currentCard + 1 < children.length ? children[currentCard + 1] : null;

      this.setState({
         childA: nextChildren,
         childB: children[currentCard],
         centerChild: children[currentCard]
      });
   }

   render() {
      const { childA, childB, centerChild }: Partial<CardsOptimizationState> = this.state;
      return (
         <>
            <View style={[styles.childrenWrapper, { zIndex: centerChild === childB ? 1 : 0 }]}>
               {childB}
            </View>
            <View style={[styles.childrenWrapper, { zIndex: centerChild === childA ? 1 : 0 }]}>
               {childA}
            </View>
         </>
      );
   }

   componentDidUpdate(prevProps: CardsOptimizationProps): void {
      const { childA, childB }: Partial<CardsOptimizationState> = this.state;

      if (this.props.currentCard !== prevProps.currentCard) {
         this.loadNextChild();
      }

      if (
         React.Children.toArray(this.props.children).length !==
         React.Children.toArray(prevProps.children).length
      ) {
         // If we are in the last position without any next child and then children are added we need to refresh:
         if (childA == null || childB == null) {
            this.loadNextChild();
         }
      }
   }

   /*
      We need 2 cards visible at the same time, for transition animation, we need the  current visible
      one and the next one. This is implemented in a way that also is optimized to not trigger 
      re renderings, this is how it works:

      To load a new card we assign the new card in the same variable than the card being unloaded,
      so we only need 2 variables for the 2 children being rendered at the same time, zIndex is 
      used to render the corresponding children on top (instead of using the component three for that).
      All this approach doesn't trigger unnecessary render calls because it does not change the structure
      of the component three.
      More details:
      Variables: childB and childA, when the child to unload is childA the next time will be childB
      so this variable replacement approach switches back and forth with these 2 variables.  
      We also need to store which variable is currently the front card to be able to assign the
      correct zIndex value, the variable for that is centerChild.
   */
   loadNextChild(): void {
      const { currentCard }: Partial<CardsOptimizationProps> = this.props;
      const { centerChild, childA, childB }: Partial<CardsOptimizationState> = this.state;
      const children: React.ReactNode[] = React.Children.toArray(this.props.children);

      const nextChildren: React.ReactNode =
         currentCard + 1 < children.length ? children[currentCard + 1] : null;

      /*
         This childB == null is here to make sure a new child goes to the null holder when it's neccesary.
         New children meaning when new elements are added to the props.children
      */
      if (centerChild === childB || childB == null) {
         this.setState({
            childB: nextChildren,
            centerChild: childA
         });
      } else {
         this.setState({
            childA: nextChildren,
            centerChild: childB
         });
      }
   }
}

const styles: Styles = StyleSheet.create({
   childrenWrapper: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
   }
});

export default CardsOptimization;
