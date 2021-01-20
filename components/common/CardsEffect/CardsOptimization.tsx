import React, { FC, ReactElement, ReactNode, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useEffectExceptOnMount } from "../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface CardsOptimizationProps {
   currentCard: number;
   disableOptimization?: boolean;
}

/**
 * Renders only 2 of the children: The currentCard prop is the child index to render, the next one
 * will also be rendered with a lower z-index in order to be able to implement animations or to pre
 * load images. So this works only when the next child to render is the next one on the list, jumping
 * is not recommended. This z-index switch approach is a solution to switch components without re rendering.
 */
const CardsOptimization: FC<CardsOptimizationProps> = props => {
   const [childA, setChildA] = useState<ReactNode>(null);
   const [childB, setChildB] = useState<ReactNode>(null);
   const [childAtFront, setChildAtFront] = useState<ReactNode>(null);
   const childrenAsArray: ReactElement[] = React.Children.toArray(props.children) as ReactElement[];

   useEffect(() => {
      const nextChildren: React.ReactNode =
         props.currentCard + 1 < childrenAsArray.length
            ? childrenAsArray[props.currentCard + 1]
            : null;

      setChildA(nextChildren);
      setChildB(childrenAsArray[props.currentCard]);
      setChildAtFront(childrenAsArray[props.currentCard]);
   }, []);

   useEffectExceptOnMount(() => {
      showNextChildAndPreloadFollowing();
   }, [props.currentCard]);

   useEffectExceptOnMount(() => {
      // If we are in the last position without any next child and then children are added we need to refresh:
      if (childA == null || childB == null) {
         showNextChildAndPreloadFollowing();
      }
   }, [childrenAsArray.length]);

   const showNextChildAndPreloadFollowing = () => {
      const nextChildren: React.ReactNode =
         props.currentCard + 1 < childrenAsArray.length
            ? childrenAsArray[props.currentCard + 1]
            : null;

      /*
         This childB == null is here to make sure a new child goes to the null holder when it's necessary.
         New children meaning when new elements are added to the props.children
      */
      if (childAtFront === childB || childB == null) {
         setChildAtFront(childA);
         setChildB(nextChildren);
      } else {
         setChildAtFront(childB);
         setChildA(nextChildren);
      }
   };

   if (props.disableOptimization) {
      return childrenAsArray[props.currentCard];
   }

   return (
      <>
         <View style={[styles.childrenWrapper, { zIndex: childAtFront === childB ? 1 : 0 }]}>
            {childB}
         </View>
         <View style={[styles.childrenWrapper, { zIndex: childAtFront === childA ? 1 : 0 }]}>
            {childA}
         </View>
      </>
   );
};

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
