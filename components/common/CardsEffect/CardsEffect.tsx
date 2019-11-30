import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface CardsEffectProps {
   currentCard: number;
   lastCardWasLiked?: boolean;
}
export interface CardsEffectState { }

class CardsEffect extends Component<CardsEffectProps, CardsEffectState> {
   render(): JSX.Element {
      const {currentCard, lastCardWasLiked }: Partial<CardsEffectProps> = this.props;
      const children: React.ReactNode[] = React.Children.toArray(this.props.children);

      return (
         <>
         {
            currentCard + 1 < children.length &&
               <View style={styles.childrenWrapper}>
                  {children[currentCard + 1]}
               </View>
         }
         <View style={styles.childrenWrapper}>
            {children[currentCard]}
         </View>
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   childrenWrapper: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
   },
});

export default CardsEffect;
