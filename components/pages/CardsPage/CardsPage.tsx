import React, { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import NoMoreUsersMessage from "./NoMoreUsersMessage/NoMoreUsersMessage";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { useCardsDataManager } from "./tools/useCardsDataManager";
import { AttractionType, User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import WatchingIndicator from "./WatchingIndicator/WatchingIndicator";
import { CardsSource } from "./tools/types";
import {
   useRequestMoreCardsWhenNeeded,
   useSendAttractionsQueueIfNeeded
} from "./tools/useSendAttractionsAndRequestMoreCards";
import { useCardsFromServer } from "./tools/useCardsFromServer";
import { useCardsSourceAutomaticChange } from "./tools/useCardsSourceAutomaticChange";
import { analyticsLogEvent } from "../../../common-tools/analytics/tools/analyticsLog";
import { useAnalyticsForCardsPage } from "../../../common-tools/analytics/cardsPage/useAnalyticsForCardsPage";
import { useUser } from "../../../api/server/user";
import NeedLocationMessage from "./NeedLocationMessage/NeedLocationMessage";
import { useUpdateGeolocationIfPossible } from "./tools/useUpdateGeolocationIfPossible";

export interface ParamsCardsPage {
   cardsSource?: CardsSource;
   tagId?: string;
   tagName?: string;
}

const CardsPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsCardsPage>>();
   const { data: user } = useUser();
   const updateResult = useUpdateGeolocationIfPossible();
   const [cardsSource, setCardsSource] = useState(CardsSource.Recommendations);
   const cardsFromServer = useCardsFromServer(cardsSource, {
      tagId: params?.tagId,
      enabled: user?.locationLat != null && user?.locationLon != null && updateResult != null
   });
   const manager = useCardsDataManager(cardsFromServer);
   useRequestMoreCardsWhenNeeded({
      manager,
      cardsSource,
      cardsFromServer,
      tagId: params?.tagId,
      disableAppendMode: user?.demoAccount
   });
   useSendAttractionsQueueIfNeeded({ manager });
   useCardsSourceAutomaticChange({ cardsFromServer, params, cardsSource, setCardsSource });
   useAnalyticsForCardsPage(manager.usersToRender);

   const handleLikeOrDislikePress = (attractionType: AttractionType, userId: string) => {
      manager.addAttractionToQueue({ userId, attractionType });
      manager.moveToNextUser(userId);
      analyticsLogEvent(`${attractionType === AttractionType.Like ? "like" : "dislike"}_pressed`);
   };

   const handleUndoPress = (userId: string) => {
      const positionInList = manager.usersToRender.findIndex(u => u.userId === userId);
      const previousUser: User = manager.usersToRender[positionInList - 1];
      manager.removeFromAttractionsQueue([{ userId: previousUser.userId }]);
      manager.goBackToPreviousUser(userId);
   };

   const handleViewDislikedUsersPress = useCallback(() => {
      setCardsSource(CardsSource.DislikedUsers);
      analyticsLogEvent("disliked_users_view_again_pressed");
   }, []);

   const handleGoBackToRecommendations = useCallback(() => {
      setCardsSource(CardsSource.Recommendations);
   }, []);

   if (!user) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   if (user?.locationLat == null || user?.locationLon == null) {
      return (
         <View style={styles.mainContainer}>
            <NeedLocationMessage />
         </View>
      );
   }

   const isLoading = updateResult == null || manager.isLoading;

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
                        cardsSource === CardsSource.DislikedUsers ? "ocultadxs" : params?.tagName
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
