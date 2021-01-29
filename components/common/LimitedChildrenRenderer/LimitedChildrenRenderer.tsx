import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useEffectExceptOnMount } from "../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface LimitedChildrenRendererProps {
   childrenToDisplay: number;
   singleChildrenMode?: boolean;
}

/**
 * Renders only 2 of the children: The childrenToDisplay prop is the child index to render, the next one
 * will also be rendered with a lower z-index just in case is needed. So this works only when the next
 * child to render is the next one on the list, jumping is not recommended. This z-index switch approach
 * is a solution to switch visibility of components when they are on top of each other without re rendering,
 * useful for some ui styles.
 */
const LimitedChildrenRenderer: FC<LimitedChildrenRendererProps> = props => {
   const [childA, setChildA] = useState<ReactNode>(null);
   const [childB, setChildB] = useState<ReactNode>(null);
   const [childAtFront, setChildAtFront] = useState<ReactNode>(null);
   const childrenToDisplayLastValue = useRef<number>(null);
   const childrenAsArray: ReactElement[] = React.Children.toArray(props.children) as ReactElement[];
   const initialized = useRef(false);

   const reset = () => {
      if (childrenAsArray == null || childrenAsArray.length === 0) {
         return;
      }
      setChildB(childrenAsArray[props.childrenToDisplay]);
      setChildAtFront(childrenAsArray[props.childrenToDisplay]);
      const nextChildren: React.ReactNode =
         props.childrenToDisplay + 1 < childrenAsArray.length
            ? childrenAsArray[props.childrenToDisplay + 1]
            : null;
      setChildA(nextChildren);
   };

   useEffect(() => {
      if (initialized.current) {
         return;
      }

      reset();

      childrenToDisplayLastValue.current = props.childrenToDisplay;
      initialized.current = true;
   }, [childrenAsArray.length]);

   useEffectExceptOnMount(() => {
      // If the change is the next element we can do the swipe trick
      if (props.childrenToDisplay - 1 === childrenToDisplayLastValue.current) {
         showNextChildAndPreloadFollowing();
      } else {
         // Otherwise there is no trick we reset the swipe
         reset();
      }

      childrenToDisplayLastValue.current = props.childrenToDisplay;
   }, [props.childrenToDisplay]);

   const showNextChildAndPreloadFollowing = () => {
      const nextChildren: React.ReactNode =
         props.childrenToDisplay + 1 < childrenAsArray.length
            ? childrenAsArray[props.childrenToDisplay + 1]
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

   if (props.singleChildrenMode) {
      return childrenAsArray[props.childrenToDisplay];
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

export default LimitedChildrenRenderer;
