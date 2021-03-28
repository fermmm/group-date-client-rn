import React, { FC, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { __String } from "typescript";
import { useCardsDataManager } from "./tools/useCardsDataManager";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { AttractionType } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import WatchingIndicator from "./WatchingIndicator/WatchingIndicator";
import { CardsSource } from "./tools/types";
import { useSendAttractionsAndRequestMoreCards } from "./tools/useSendAttractionsAndRequestMoreCards";
import { useCardsFromServer } from "./tools/useCardsFromServer";

// TODO: Cuando se terminan las cartas de una tematica queda cargando

export interface ParamsCardsPage {
   cardsSource?: CardsSource;
   tagId?: string;
   tagName?: string;
   /** This should contain a random number changed on each navigate() to trigger useEffect every time when coming from tag modal */
   comingFromTagModal?: number;
}

const CardsPage: FC = () => {
   const [cardsSource, setCardsSource] = useState<CardsSource>(CardsSource.Recommendations);
   const { params } = useRoute<RouteProps<ParamsCardsPage>>();
   const { token } = useFacebookToken();
   const cardsFromServer = useCardsFromServer(cardsSource, { tagId: params?.tagId });
   const manager = useCardsDataManager(cardsFromServer);

   /**
    * This hook sends the likes and dislikes when needed (after time or when running out of cards).
    * Also requests more cards if needed
    */
   useSendAttractionsAndRequestMoreCards({
      manager,
      token,
      cardsSource,
      cardsFromServer,
      tagId: params?.tagId
   });

   const isLoading =
      cardsFromServer == null ||
      (manager.currentUserDisplaying >= manager.usersToRender.length && !manager.noMoreUsersLeft);

   // Effect that changes the card source when received on navigate params (currently only used for tags)
   useEffect(() => {
      if (params?.cardsSource != null) {
         setCardsSource(params.cardsSource);
      }
   }, [params?.cardsSource, params?.tagId, params?.comingFromTagModal]);

   // Effect to go back to recommendations when there are no more users on the current mode
   useEffect(() => {
      if (cardsSource === CardsSource.Recommendations) {
         return;
      }

      if (cardsFromServer == null) {
         return;
      }

      if (cardsFromServer.length > 0) {
         return;
      }

      if (cardsSource === CardsSource.DislikedUsers) {
         Alert.alert("", "No hay mas personas dejadas de lado para mostrar");
      }

      if (cardsSource === CardsSource.Tag) {
         Alert.alert("", `No hay mas personas para mostrar en ${params?.tagName}`);
      }

      setCardsSource(CardsSource.Recommendations);
   }, [cardsFromServer, cardsSource, params?.tagId]);

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
         {manager.noMoreUsersLeft ? (
            <NoMoreUsersMessage onViewDislikedUsersPress={handleViewDislikedUsersPress} />
         ) : (
            <>
               <LimitedChildrenRenderer childToFocus={manager.currentUserDisplaying}>
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
                     name={
                        cardsSource === CardsSource.DislikedUsers
                           ? "dejadxs de lado"
                           : params?.tagName
                     }
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

export default CardsPage;
