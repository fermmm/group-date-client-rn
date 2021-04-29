import React, { PropsWithChildren, ReactElement, ReactNode, useRef, useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useEffectExceptOnMount } from "../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Styles } from "../../../common-tools/ts-tools/Styles";

interface PropsLimitedComponentRenderer<T> {
   elementIndexToRender: number;
   elementsListProps: T[];
   renderElement: (props: T) => ReactElement;
}

/**
 * This component it's not being used and it's not tested. It's an alternative version to LimitedChildRenderer
 * with another way of rendering components that could be better to improve rendering issues.
 */
const LimitedComponentRenderer = <T extends unknown>(
   props: PropsWithChildren<PropsLimitedComponentRenderer<T>>
): ReactElement | null => {
   const { elementIndexToRender, elementsListProps, renderElement } = props;

   const [elementA, setElementA] = useState<T>(null);
   const [elementB, setElementB] = useState<T>(null);
   const [itemAtFront, setElementAtFront] = useState<T>(null);
   const elementToDisplayLastValue = useRef<number>(null);

   const getCurrentElement = () => {
      return elementsListProps[elementIndexToRender];
   };

   const getNextElementIfAny = () => {
      if (elementsListProps == null || elementsListProps.length === 0) {
         return null;
      }

      return elementIndexToRender + 1 < elementsListProps.length
         ? elementsListProps[elementIndexToRender + 1]
         : null;
   };

   const reset = () => {
      if (elementsListProps == null || elementsListProps.length === 0) {
         return;
      }
      const currentElement = getCurrentElement();
      const nextElement: T = getNextElementIfAny();

      setElementAtFront(currentElement);
      setElementB(currentElement);
      setElementA(nextElement);
   };

   useEffect(() => {
      reset();
      elementToDisplayLastValue.current = elementIndexToRender;
   }, [elementsListProps]);

   useEffectExceptOnMount(() => {
      // If the change is the next element we can do the swipe trick
      if (elementIndexToRender === elementToDisplayLastValue.current + 1) {
         showNextElementAndPreloadFollowing();
      } else {
         // Otherwise there is no trick we reset the swipe
         reset();
      }

      elementToDisplayLastValue.current = elementIndexToRender;
   }, [elementIndexToRender]);

   const showNextElementAndPreloadFollowing = () => {
      const nextElement: T = getNextElementIfAny();

      /*
         This elementB == null is here to make sure a new element goes to the null holder when it's necessary.
         New element meaning when new elements are added to the elementsProps array
      */
      if (itemAtFront === elementB || elementB == null) {
         setElementAtFront(elementA);
         setElementB(nextElement);
      } else {
         setElementAtFront(elementB);
         setElementA(nextElement);
      }
   };

   return (
      <>
         <View style={[styles.childrenWrapper, { zIndex: itemAtFront === elementB ? 1 : 0 }]}>
            {renderElement(elementB)}
         </View>
         <View style={[styles.childrenWrapper, { zIndex: itemAtFront === elementA ? 1 : 0 }]}>
            {renderElement(elementA)}
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

export default LimitedComponentRenderer;
