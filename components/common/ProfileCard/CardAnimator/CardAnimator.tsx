import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { LogoSvg } from "../../../../assets/LogoSvg";
import color from "color";
import { currentTheme } from "../../../../config";
import { CardAnimation, CardAnimatedStyles } from "./animations/interface/CardAnimation";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { LikeAnimation } from "./animations/LikeAnimation";
import { DislikeAnimation } from "./animations/DislikeAnimation";
import { BackCardSlowAnimation } from "./animations/BackCardSlow";

export interface CardAnimatorProps {
   animate?: CardAnimationType;
   onAnimationFinish?: () => void;
}

export enum CardAnimationType {
   Like,
   Dislike,
   Appear,
   AppearFast
}

/**
 * This component performs the animations on the child
 */
const CardAnimator: FC<CardAnimatorProps> = props => {
   const [containerAnimValue, setContainerAnimValue] = useState(new Animated.Value(0));
   const [logoAnimValue, setLogoAnimValue] = useState(new Animated.Value(0));
   const [cardAnimation, setCardAnimation] = useState<CardAnimation>(null);
   const [shadowAnimValue, setShadowAnimValue] = useState(new Animated.Value(0));
   const animStyles = useRef<CardAnimatedStyles>(null);
   const { colors } = useTheme();

   if (cardAnimation != null) {
      animStyles.current = cardAnimation.interpolation(
         containerAnimValue,
         logoAnimValue,
         shadowAnimValue
      );
   }

   if (animStyles.current == null) {
      animStyles.current = { cardStyle: null, logoStyle: null };
   }

   const getAnimationInstance = (animation: CardAnimationType): CardAnimation => {
      switch (animation) {
         case CardAnimationType.Like:
            return new LikeAnimation();
            break;
         case CardAnimationType.Dislike:
            return new DislikeAnimation();
            break;
         case CardAnimationType.Appear:
            return new BackCardSlowAnimation();
            break;
         case CardAnimationType.AppearFast:
            return new BackCardSlowAnimation();
            break;
      }
   };

   const animate = async (animation: CardAnimationType, onComplete: () => void = null) => {
      const anim = getAnimationInstance(animation);
      setCardAnimation(anim);
      await anim.trigger(containerAnimValue, logoAnimValue, shadowAnimValue);
      setCardAnimation(null);
      setContainerAnimValue(new Animated.Value(0));
      setLogoAnimValue(new Animated.Value(0));
      setShadowAnimValue(new Animated.Value(0));
      if (onComplete != null) {
         onComplete();
      }
   };

   useEffect(() => {
      if (props.animate != null) {
         animate(props.animate, props.onAnimationFinish);
      }
   }, [props.animate]);

   return (
      <>
         <Animated.View
            style={[styles.shadow, animStyles.current.shadowStyle]}
            pointerEvents="none"
         />
         <Animated.View
            style={[{ flex: 1 }, animStyles.current.cardStyle]}
            pointerEvents={props.animate != null ? "none" : null}
         >
            {props.children}
            {animStyles.current.logoStyle != null && (
               <Animated.View
                  style={[styles.logoAnimationContainer, animStyles.current.logoStyle]}
                  pointerEvents="none"
               >
                  <View style={styles.logoContainer} pointerEvents="none">
                     <LogoSvg color={colors.primary2} style={styles.logo} />
                  </View>
               </Animated.View>
            )}
         </Animated.View>
      </>
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
   },
   shadow: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "black"
   }
});

export default CardAnimator;
