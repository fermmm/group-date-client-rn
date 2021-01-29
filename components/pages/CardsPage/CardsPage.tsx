import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { useCardsDisliked, useCardsRecommendations } from "../../../api/server/cards-game";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { __String } from "typescript";
import { AttractionsSendReason, useCardsDataManager } from "./hooks/useCardsDataManager";
import { useAttractionMutation } from "../../../api/server/user";
import { queryClient } from "../../../api/tools/reactQueryTools";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { AttractionType } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import WatchingIndicator from "./WatchingIndicator/WatchingIndicator";

export interface ParamsCardsPage {
   specialCardsSource?: CardsSource;
   themeId?: string;
}

const CardsPage: FC = () => {
   const { token } = useFacebookToken();
   const { params } = useRoute<RouteProps<ParamsCardsPage>>();
   const [cardsSource, setCardsSource] = useState<CardsSource>(CardsSource.Recommendations);
   const { data: recommendations } = useCardsRecommendations(null, {
      enabled: cardsSource === CardsSource.Recommendations
   });
   const { data: dislikedUsers } = useCardsDisliked(null, {
      enabled: cardsSource === CardsSource.DislikedUsers
   });
   const usersFromServer =
      cardsSource === CardsSource.Recommendations
         ? recommendations
         : cardsSource === CardsSource.DislikedUsers
         ? dislikedUsers
         : recommendations;
   const manager = useCardsDataManager(usersFromServer);
   const { mutate: sendAttractionsToServer } = useAttractionMutation();

   const noMoreUsersLeft =
      manager.userDisplaying >= manager.usersToRender.length && usersFromServer?.length === 0;

   const isLoading =
      usersFromServer == null ||
      (manager.userDisplaying >= manager.usersToRender.length && !noMoreUsersLeft);

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

                  // This requests new users by invalidating the cache:
                  queryClient.invalidateQueries("cards-game/recommendations");
                  queryClient.invalidateQueries("cards-game/disliked-users");
               }
            }
         }
      );
   }, [manager.attractionsShouldBeSentReason]);

   const handleLikeOrDislikeTouch = (attractionType: AttractionType, userId: string) => {
      manager.addAttractionToQueue({ userId, attractionType });
      manager.moveToNextUser(userId);
   };

   const handleDislikedUsersTouch = useCallback(() => {
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
            <NoMoreUsersMessage onDislikedUsersClick={handleDislikedUsersTouch} />
         ) : (
            <>
               <LimitedChildrenRenderer childrenToDisplay={manager.userDisplaying}>
                  {manager.usersToRender.map(user => (
                     <ProfileCard
                        showLikeDislikeButtons
                        user={user}
                        onLikeClick={() =>
                           handleLikeOrDislikeTouch(AttractionType.Like, user.userId)
                        }
                        onDislikeClick={() =>
                           handleLikeOrDislikeTouch(AttractionType.Dislike, user.userId)
                        }
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
