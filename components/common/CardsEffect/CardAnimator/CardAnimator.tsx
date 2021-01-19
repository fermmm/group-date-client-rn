import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../../assets/LogoSvg";
import color from "color";
import { currentTheme } from "../../../../config";
import { CardAnimation, CardAnimatedStyles } from "./animations/interface/CardAnimation";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";

export interface CardAnimatorProps {
   onMount: (compFunctions: FunctionsCardAnimator) => void;
}

export type FunctionsCardAnimator = {
   animate: (cardAnimation: CardAnimation, onComplete: () => void) => void;
};

/**
 * This component performs the animations on the child
 */
const CardAnimator: FC<CardAnimatorProps> = props => {
   const [containerAnimValue, setContainerAnimValue] = useState(new Animated.Value(0));
   const [logoAnimValue, setLogoAnimValue] = useState(new Animated.Value(0));
   const [cardAnimation, setCardAnimation] = useState<CardAnimation>(null);
   const animStyles = useRef<CardAnimatedStyles>(null);
   const { colors } = useTheme();

   if (cardAnimation != null) {
      animStyles.current = cardAnimation.interpolation(containerAnimValue, logoAnimValue);
   }

   if (animStyles.current == null) {
      animStyles.current = { cardStyle: null, logoStyle: null };
   }

   const animate = useCallback(
      (cardAnimation: CardAnimation, onComplete: () => void = null): void => {
         setCardAnimation(cardAnimation);
         cardAnimation.trigger(containerAnimValue, logoAnimValue, () => {
            setCardAnimation(null);
            // setContainerAnimValue(new Animated.Value(0));
            // setLogoAnimValue(new Animated.Value(0));
            // TODO: Esto antes era como arriba pero podria ser asi, ver si anda
            containerAnimValue.setValue(0);
            logoAnimValue.setValue(0);
            if (onComplete != null) {
               onComplete();
            }
         });
      },
      []
   );

   useEffect(() => {
      if (props.onMount != null) {
         props.onMount({ animate });
      }
   }, []);

   return (
      <Animated.View style={[{ flex: 1 }, animStyles.current.cardStyle]}>
         {props.children}
         {animStyles.current.logoStyle != null && (
            <Animated.View style={[styles.logoAnimationContainer, animStyles.current.logoStyle]}>
               <View style={styles.logoContainer}>
                  <LogoSvg color={colors.primary2} style={styles.logo} />
               </View>
            </Animated.View>
         )}
      </Animated.View>
   );
};

const styles: Styles = StyleSheet.create({
   logoAnimationContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center"
   },
   logoContainer: {
      width: "65%",
      marginBottom: 150,
      backgroundColor: color(currentTheme.colors.primary2).alpha(0.07).toString(),
      padding: 30,
      borderRadius: 9999
   },
   logo: {
      paddingTop: 16
   }
});

export default CardAnimator;
