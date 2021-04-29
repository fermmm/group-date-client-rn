import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useEffectExceptOnMount } from "../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface LimitedChildrenRendererProps {
   childToFocus: number;
   singleChildrenMode?: boolean;
}

/**
 * Renders only 2 of the children: The childrenToDisplay prop is the child index to render, the next one
 * will also be rendered with a lower z-index just in case is needed. So this works only when the next
 * child to render is the next one on the list, jumping is not recommended. This z-index switch approach
 * is a solution to switch visibility of components when they are on top of each other without re rendering,
 * useful for some ui concepts.
 */
const LimitedChildrenRenderer: FC<LimitedChildrenRendererProps> = props => {
   const [childA, setChildA] = useState<ReactNode>(null);
   const [childB, setChildB] = useState<ReactNode>(null);
   const [childAtFront, setChildAtFront] = useState<ReactNode>(null);
   const childrenToDisplayLastValue = useRef<number>(null);
   const childrenAsArray: ReactElement[] = React.Children.toArray(props.children) as ReactElement[];
   // This is useful to know if the children list really changed because props.children always has a reference change
   const childrenKeysAsString = childrenAsArray.map(c => c.key).join();

   const getChildToFocus = () => {
      return childrenAsArray[props.childToFocus];
   };

   const getNextChildIfAny = () => {
      if (childrenAsArray == null || childrenAsArray.length === 0) {
         return null;
      }

      return props.childToFocus + 1 < childrenAsArray.length
         ? childrenAsArray[props.childToFocus + 1]
         : null;
   };

   const reset = () => {
      if (childrenAsArray == null || childrenAsArray.length === 0) {
         return;
      }

      const childToFocus = getChildToFocus();
      const nextChildToTheFocused = getNextChildIfAny();

      setChildAtFront(childToFocus);
      setChildB(childToFocus);
      setChildA(nextChildToTheFocused);
   };

   useEffect(() => {
      reset();
      childrenToDisplayLastValue.current = props.childToFocus;
   }, [childrenKeysAsString]);

   useEffectExceptOnMount(() => {
      // If the change is the next element we can do the swipe trick
      if (props.childToFocus === childrenToDisplayLastValue.current + 1) {
         showNextChildAndPreloadFollowing();
      } else {
         // Otherwise there is no trick we reset the swipe
         reset();
      }

      childrenToDisplayLastValue.current = props.childToFocus;
   }, [props.childToFocus]);

   const showNextChildAndPreloadFollowing = () => {
      const nextChildToTheFocused = getNextChildIfAny();

      /*
         This childB == null is here to make sure a new child goes to the null holder when it's necessary.
      */
      if (childAtFront === childB || childB == null) {
         setChildAtFront(childA);
         setChildB(nextChildToTheFocused);
      } else {
         setChildAtFront(childB);
         setChildA(nextChildToTheFocused);
      }
   };

   if (props.singleChildrenMode) {
      return childrenAsArray[props.childToFocus];
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
