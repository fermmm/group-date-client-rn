import React, { FC, useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import CardsOptimization from "../../common/CardsEffect/CardsOptimization";
import CardAnimator, {
   FunctionsCardAnimator
} from "../../common/CardsEffect/CardAnimator/CardAnimator";
import { LikeAnimation } from "../../common/CardsEffect/CardAnimator/animations/LikeAnimation";
import { DislikeAnimation } from "../../common/CardsEffect/CardAnimator/animations/DislikeAnimation";
import { BackCardSlowAnimation } from "../../common/CardsEffect/CardAnimator/animations/BackCardSlow";
import { BackCardFastAnimation } from "../../common/CardsEffect/CardAnimator/animations/BackCardFast";
import { useCardsRecommendations } from "../../../api/server/cards-game";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { __String } from "typescript";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";

// TODO: Aveces useUser no responde
// TODO: El animator no estaria andando, pero hay que probar primero resolviendo lo anterior
// TODO: Cuando users.length es 0 hay que pedir de vuelta al server y si sigue siendo 0 mostrar el mensaje de que no hay usuarios
const CardsPage: FC = () => {
   const animRefs = useRef<FunctionsCardAnimator[]>([]);
   const [currentUser, setCurrentUser] = useState(0);
   const [animating, setAnimating] = useState(false);
   const [noMoreUsersOnServer, setNoMoreUsersOnServer] = useState(false);
   const { data: users, isLoading } = useCardsRecommendations();

   const handleLikeOrDislike = async (liked: boolean, userId: string) => {
      if (animating) {
         return;
      }

      const positionInList = users.findIndex(u => u.userId === userId);
      console.log("positionInList", positionInList);
      // This animation flips the current card so the one behind is revealed (if present)
      // await animateCards(liked);

      if (thereIsANextCard(positionInList, users)) {
         // If present this loads the next card and renders it hidden behind the current one
         setCurrentUser(positionInList + 1);
      } else {
         // Here show a loading indicator and request new cards, if there are no new cards execute this:
         setNoMoreUsersOnServer(true);
      }
   };

   const animateCards = (liked: boolean) => {
      return new Promise<void>(resolve => {
         setAnimating(true);
         let finishedAnimationsAmount: number = 0;
         const totalAnimationsToPlay: number = currentUser + 1 < users.length ? 2 : 1;

         animRefs.current[currentUser].animate(
            liked ? new LikeAnimation() : new DislikeAnimation(),
            () => {
               finishedAnimationsAmount++;
               if (finishedAnimationsAmount === totalAnimationsToPlay) {
                  setAnimating(false);
                  resolve();
               }
            }
         );

         if (currentUser + 1 < users.length) {
            animRefs.current[currentUser + 1].animate(
               liked ? new BackCardSlowAnimation() : new BackCardFastAnimation(),
               () => {
                  finishedAnimationsAmount++;
                  if (finishedAnimationsAmount === totalAnimationsToPlay) {
                     setAnimating(false);
                     resolve();
                  }
               }
            );
         }
      });
   };

   const thereIsANextCard = (currentPosition: number, usersList: User[]): boolean => {
      return currentPosition + 1 < users.length;
   };

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <View style={styles.mainContainer}>
         {noMoreUsersOnServer ? (
            <NoMoreUsersMessage />
         ) : (
            <CardsOptimization currentCard={currentUser} disableOptimization={false}>
               {users.map((user, i) => (
                  // <CardAnimator
                  //    onMount={compFunctions => (animRefs.current[i] = compFunctions)}
                  //    key={user.userId}
                  // >
                  <ProfileCard
                     user={user}
                     onLikeClick={() => handleLikeOrDislike(true, user.userId)}
                     onDislikeClick={() => handleLikeOrDislike(false, user.userId)}
                     showLikeDislikeButtons
                     key={user.userId}
                  />
                  // </CardAnimator>
               ))}
            </CardsOptimization>
         )}
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      backgroundColor: currentTheme.colors.background,
      flex: 1,
      padding: 0
   }
});

export default CardsPage;
