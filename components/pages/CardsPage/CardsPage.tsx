import React, { FC, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { useCardsDisliked, useCardsRecommendations } from "../../../api/server/cards-game";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { __String } from "typescript";
import { AttractionsSendReason, useCardsDataManager } from "./hooks/useCardsDataManager";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { AttractionType } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import WatchingIndicator from "./WatchingIndicator/WatchingIndicator";
import { sendAttraction } from "../../../api/server/user";
import { revalidate } from "../../../api/tools/useCache";

export interface ParamsCardsPage {
   specialCardsSource?: CardsSource;
   themeId?: string;
}

const CardsPage: FC = () => {
   const { token } = useFacebookToken();
   const { params } = useRoute<RouteProps<ParamsCardsPage>>();
   const [cardsSource, setCardsSource] = useState<CardsSource>(CardsSource.Recommendations);
   const { data: recommendations } = useCardsRecommendations({
      config: {
         enabled: cardsSource === CardsSource.Recommendations
      }
   });
   const { data: dislikedUsers } = useCardsDisliked({
      config: {
         enabled: cardsSource === CardsSource.DislikedUsers
      }
   });
   const usersFromServer =
      cardsSource === CardsSource.Recommendations
         ? recommendations
         : cardsSource === CardsSource.DislikedUsers
         ? dislikedUsers
         : recommendations;
   const manager = useCardsDataManager(usersFromServer);

   const noMoreUsersLeft =
      manager.userDisplaying >= manager.usersToRender.length && usersFromServer?.length === 0;

   const isLoading =
      usersFromServer == null ||
      (manager.userDisplaying >= manager.usersToRender.length && !noMoreUsersLeft);

   // This effect sends the attractions to the server if it's required
   React.useEffect(() => {
      (async () => {
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

         const attractions = [...manager.attractionsQueue.current];

         await sendAttraction({ attractions, token });
         manager.removeFromAttractionsQueue(attractions);
         revalidate("cards-game/disliked-users");

         if (
            reason === AttractionsSendReason.NoMoreUsersButServerMayHave ||
            reason === AttractionsSendReason.NearlyRunningOutOfUsers
         ) {
            // Load more while reviewing the users is not possible with disliked users list because contains repetitions
            if (
               cardsSource === CardsSource.DislikedUsers &&
               reason === AttractionsSendReason.NearlyRunningOutOfUsers
            ) {
               return;
            }

            // If last time the server returned no users then there is no need to request again
            if (usersFromServer?.length === 0) {
               return;
            }

            /**
             * It's required to add the new cards to the end of the list, and not replace the list,
             * because when new cards arrive the user is probably still finishing the previous ones.
             * Disliked users list contains repetitions so in that case we always replace the current list.
             */
            if (cardsSource !== CardsSource.DislikedUsers) {
               manager.appendUsersFromServerInNextUpdate();
            }

            // This triggers the request of new users by invalidating the cache:
            revalidate("cards-game/recommendations");
         }
      })();
   }, [manager.attractionsShouldBeSentReason]);

   // Effect to automatically quit disliked users mode when there is no disliked users
   useEffect(() => {
      if (dislikedUsers?.length === 0 && cardsSource === CardsSource.DislikedUsers) {
         Alert.alert("", "No hay mas gente dejada de lado para mostrar");
         setCardsSource(CardsSource.Recommendations);
      }
   }, [dislikedUsers, cardsSource]);

   const handleLikeOrDislikePress = (attractionType: AttractionType, userId: string) => {
      manager.addAttractionToQueue({ userId, attractionType });
      manager.moveToNextUser(userId);
   };

   const handleUndoPress = (userId: string) => {
      const positionInList = manager.usersToRender.findIndex(u => u.userId === userId);
      const previousUserId: string = manager.usersToRender[positionInList - 1].userId;
      manager.removeFromAttractionsQueue([{ userId: previousUserId }]);
      manager.goBackToPreviousUser(userId);
   };

   const handleViewDislikedUsersPress = useCallback(() => {
      setCardsSource(CardsSource.DislikedUsers);
   }, []);

   const handleGoBackToRecommendations = useCallback(() => {
      setCardsSource(CardsSource.Recommendations);
   }, []);

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <View style={styles.mainContainer}>
         {noMoreUsersLeft ? (
            <NoMoreUsersMessage onViewDislikedUsersPress={handleViewDislikedUsersPress} />
         ) : (
            <>
               <LimitedChildrenRenderer childToFocus={manager.userDisplaying}>
                  {manager.usersToRender.map((user, i) => (
                     <ProfileCard
                        showLikeDislikeButtons
                        user={user}
                        onLikePress={() =>
                           handleLikeOrDislikePress(AttractionType.Like, user.userId)
                        }
                        onDislikePress={() =>
                           handleLikeOrDislikePress(AttractionType.Dislike, user.userId)
                        }
                        onUndoPress={i > 0 ? () => handleUndoPress(user.userId) : null}
                        key={user.userId}
                     />
                  ))}
               </LimitedChildrenRenderer>
               {cardsSource !== CardsSource.Recommendations && (
                  <WatchingIndicator
                     name={cardsSource === CardsSource.DislikedUsers ? "Dejados de lado" : "Theme"}
                     onPress={handleGoBackToRecommendations}
                  />
               )}
            </>
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

export enum CardsSource {
   Recommendations,
   Theme,
   DislikedUsers
}

export default CardsPage;
