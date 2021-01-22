import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import CardsOptimization from "../../common/CardsEffect/CardsOptimization";
import { useCardsRecommendations } from "../../../api/server/cards-game";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { __String } from "typescript";

// TODO: Cuando users.length es 0 hay que pedir de vuelta al server y si sigue siendo 0 mostrar el mensaje de que no hay usuarios
const CardsPage: FC = () => {
   const [currentUser, setCurrentUser] = useState(0);
   const [noMoreUsersOnServer, setNoMoreUsersOnServer] = useState(false);
   const { data: users, isLoading } = useCardsRecommendations();

   const handleLikeOrDislike = (liked: boolean, userId: string) => {
      const positionInList = users.findIndex(u => u.userId === userId);

      if (thereIsANextCard(positionInList)) {
         // If present this loads the next card and renders it hidden behind the current one
         setCurrentUser(positionInList + 1);
      } else {
         // Here show a loading indicator and request new cards, if there are no new cards execute this:
         setNoMoreUsersOnServer(true);
      }
   };

   const thereIsANextCard = (currentPosition: number): boolean => {
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
                  <ProfileCard
                     user={user}
                     onLikeClick={() => handleLikeOrDislike(true, user.userId)}
                     onDislikeClick={() => handleLikeOrDislike(false, user.userId)}
                     key={user.userId}
                     showLikeDislikeButtons
                  />
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
