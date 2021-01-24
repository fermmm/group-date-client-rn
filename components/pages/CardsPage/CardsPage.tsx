import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { useCardsRecommendations } from "../../../api/server/cards-game";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { __String } from "typescript";
import { AttractionsSendReason, useCardsDataManager } from "./hooks/useCardsDataManager";
import { useAttractionMutation } from "../../../api/server/user";
import { queryClient } from "../../../api/tools/reactQueryTools";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { AttractionType } from "../../../api/server/shared-tools/endpoints-interfaces/user";

// TODO: Falta la pantalla de que no hay mas usuarios, que envíe el request con eso
// TODO: Falta el botón de repasar usuarios
const CardsPage: FC = () => {
   const [userDisplaying, setUserDisplaying] = useState(0);
   const { token } = useFacebookToken();
   const { data: usersFromServer } = useCardsRecommendations();
   const { mutate: sendAttractionsToServer, isError } = useAttractionMutation();
   const manager = useCardsDataManager(usersFromServer, userDisplaying);

   const handleLikeOrDislike = (attractionType: AttractionType, userId: string) => {
      manager.addAttractionToQueue({ userId, attractionType });
      showNextUser(userId);
   };

   const showNextUser = (currentUserId: string) => {
      const positionInList = manager.usersToRender.findIndex(u => u.userId === currentUserId);
      setUserDisplaying(positionInList + 1);
   };

   // This effect sends the attractions to the server if it's required
   useEffect(() => {
      const reason = manager.attractionsShouldBeSentReason;

      if (reason === AttractionsSendReason.None) {
         return;
      }

      if (
         manager.attractionsQueue.current == null ||
         manager.attractionsQueue.current.length === 0
      ) {
         return;
      }

      console.log("Sending attractions, reason: ", manager.attractionsShouldBeSentReason);

      const attractions = [...manager.attractionsQueue.current];
      sendAttractionsToServer(
         { attractions, token },
         {
            onSuccess: () => {
               manager.removeFromAttractionsQueue(attractions);
               if (
                  reason === AttractionsSendReason.NoMoreUsersButServerMayHave ||
                  reason === AttractionsSendReason.NearlyRunningOutOfUsers
               ) {
                  if (usersFromServer == null || usersFromServer?.length > 0) {
                     // In this case we want to add the new cards to the end of the list, not replace the list.
                     manager.appendUsersFromServerInNextUpdate();
                     // If we ran out of cards we want new cards not the cache, but if the server already returned empty it's not necessary:
                     queryClient.invalidateQueries("cards-game/recommendations");
                  }
               }
            }
         }
      );
   }, [manager.attractionsShouldBeSentReason]);

   const showNoMoreUsersMessage =
      userDisplaying >= manager.usersToRender.length && usersFromServer?.length === 0;

   const isLoading =
      usersFromServer == null ||
      (userDisplaying >= manager.usersToRender.length && !showNoMoreUsersMessage);

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <View style={styles.mainContainer}>
         {showNoMoreUsersMessage ? (
            <NoMoreUsersMessage />
         ) : (
            <LimitedChildrenRenderer childrenToDisplay={userDisplaying}>
               {manager.usersToRender.map(user => (
                  <ProfileCard
                     showLikeDislikeButtons
                     user={user}
                     onLikeClick={() => handleLikeOrDislike(AttractionType.Like, user.userId)}
                     onDislikeClick={() => handleLikeOrDislike(AttractionType.Dislike, user.userId)}
                     key={user.userId}
                  />
               ))}
            </LimitedChildrenRenderer>
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
