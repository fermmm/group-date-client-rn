import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useEffectExceptOnMount } from "../../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Attraction, User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import {
   MAX_ATTRACTIONS_QUEUE_SIZE,
   SEND_ATTRACTIONS_AFTER_TIME,
   REQUEST_MORE_CARDS_ANTICIPATION
} from "../../../../config";
import { useIsFocused } from "@react-navigation/native";
import { useAppState } from "../../../../common-tools/device-native-api/state/useAppState";
import { useInterval } from "../../../../common-tools/common-hooks/useInterval";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";

export function useCardsDataManager(cardsFromServer: User[]): UseCardsDataManager {
   const isFocused = useIsFocused();
   const { isActive } = useAppState();
   const [currentUserDisplaying, setCurrentUserDisplaying] = useState(0);
   const { value: attractionsFromStorage, setValue: saveOnStorage } = useLocalStorage<Attraction[]>(
      LocalStorageKey.AttractionQueue
   );
   const [usersToRender, setUsersToRender] = useState<User[]>([]);
   const attractionsQueue = useRef<Attraction[]>([]);
   const appendMode = useRef(false);
   const [attractionsShouldBeSentReason, setAttractionsShouldBeSentReason] = useState<{
      reason: AttractionsSendReason;
   }>({ reason: AttractionsSendReason.None });
   const [shouldRequestMoreUsersReason, setShouldRequestMoreUsersReason] = useState<{
      reason: RequestMoreUsersReason;
   }>({ reason: RequestMoreUsersReason.None });
   const noMoreUsersLeft =
      currentUserDisplaying >= usersToRender.length && cardsFromServer?.length === 0;

   const isLoading =
      cardsFromServer == null ||
      (currentUserDisplaying >= usersToRender.length && !noMoreUsersLeft);
   /**
    * If more users are coming from server replace usersToRender or add them at the end of it
    */
   useEffectExceptOnMount(() => {
      if (cardsFromServer == null) {
         return;
      }

      let newUsersToRender = [];

      if (appendMode.current) {
         newUsersToRender = mergeUsersListWithDedup(usersToRender, cardsFromServer);
         appendMode.current = false;
      } else {
         newUsersToRender = cardsFromServer;
         setCurrentUserDisplaying(0);
      }

      // The server may return users that are still pending to send the attraction, these users should not be displayed
      newUsersToRender = removeUsersFromPendingAttractions(
         newUsersToRender,
         attractionsQueue.current
      );

      setUsersToRender(newUsersToRender);
   }, [cardsFromServer]);

   /**
    * Get the attraction queue from local storage. This is here because the user may have
    * attractions not sent in previous session. This executes only once because
    * attractionsFromStorage updates only once (unless refresh() is called after saving
    * but it's not).
    */
   useEffectExceptOnMount(() => {
      if (attractionsFromStorage != null) {
         attractionsQueue.current = attractionsFromStorage;
         setAttractionsShouldBeSentReason({
            reason: AttractionsSendReason.PendingAttractionsToSendFromPreviousSession
         });
      }
   }, [attractionsFromStorage]);

   /**
    * An effect to check whether the attractions queue should be sent and the reasons
    */
   useEffect(() => {
      if (attractionsQueue.current.length > MAX_ATTRACTIONS_QUEUE_SIZE) {
         setAttractionsShouldBeSentReason({
            reason: AttractionsSendReason.AttractionsQueueSizeReachedMaximum
         });
         return;
      }
   }, [currentUserDisplaying]);

   /**
    * An effect to check if more users needs to be requested and the reasons
    */
   useEffect(() => {
      if (currentUserDisplaying >= usersToRender.length && usersToRender.length > 0) {
         setShouldRequestMoreUsersReason({
            reason: RequestMoreUsersReason.NoMoreUsersButServerMayHave
         });
         return;
      }

      if (currentUserDisplaying === usersToRender.length - 1 - REQUEST_MORE_CARDS_ANTICIPATION) {
         setShouldRequestMoreUsersReason({
            reason: RequestMoreUsersReason.NearlyRunningOutOfUsers
         });
         return;
      }
   }, [currentUserDisplaying]);

   /**
    * An effect to check whether the attractions queue should be sent based on the section is focused or not
    */
   useEffect(() => {
      if (!isFocused) {
         setAttractionsShouldBeSentReason({ reason: AttractionsSendReason.UserMovedToOtherScreen });
      }
   }, [isFocused]);

   /**
    * An effect to check whether the attractions queue should be sent based on the app is minimized or not
    */
   useEffect(() => {
      if (!isActive) {
         setAttractionsShouldBeSentReason({ reason: AttractionsSendReason.AppMinimized });
      }
   }, [isActive]);

   /**
    * An effect to check whether the attractions queue should be sent based on a time interval
    */
   useInterval(() => {
      setAttractionsShouldBeSentReason({
         reason: AttractionsSendReason.TooMuchTimePassedWithoutSending
      });
   }, SEND_ATTRACTIONS_AFTER_TIME);

   const addAttractionToQueue = useCallback((attraction: Attraction) => {
      attractionsQueue.current.push(attraction);
      saveOnStorage(attractionsQueue.current);
   }, []);

   const removeFromAttractionsQueue = useCallback((toRemove: Array<{ userId: string }>) => {
      attractionsQueue.current = attractionsQueue.current.filter(
         el => toRemove.find(tr => tr.userId === el.userId) == null
      );
      saveOnStorage(attractionsQueue.current);
   }, []);

   const inNextUpdateAppendNewUsersToRenderList = useCallback(() => {
      appendMode.current = true;
   }, []);

   const moveToNextUser = (currentUserId: string) => {
      const positionInList = usersToRender.findIndex(u => u.userId === currentUserId);
      setCurrentUserDisplaying(positionInList + 1);
   };

   const goBackToPreviousUser = (currentUserId: string) => {
      const positionInList = usersToRender.findIndex(u => u.userId === currentUserId);
      setCurrentUserDisplaying(positionInList - 1);
   };

   return {
      isLoading,
      usersToRender,
      currentUserDisplaying,
      attractionsQueue,
      attractionsShouldBeSentReason,
      shouldRequestMoreUsersReason,
      noMoreUsersLeft,
      moveToNextUser,
      goBackToPreviousUser,
      addAttractionToQueue,
      removeFromAttractionsQueue,
      inNextUpdateAppendNewUsersToRenderList,
      setAttractionsShouldBeSentReason,
      setShouldRequestMoreUsersReason
   };
}

/**
 * Returns a new array where list2 elements are added at the end of list1 elements avoiding duplications.
 */
function mergeUsersListWithDedup(list1: User[], list2: User[]): User[] {
   const result = [];
   const evaluated: Set<string> = new Set();

   list1?.forEach(user => {
      result.push(user);
      evaluated.add(user.userId);
   });

   list2?.forEach(user => {
      if (!evaluated.has(user.userId)) {
         result.push(user);
      }
   });

   return result;
}

function removeUsersFromPendingAttractions(usersList: User[], attractions: Attraction[]): User[] {
   return usersList.filter(
      user => attractions.find(attraction => attraction.userId === user.userId) == null
   );
}

export interface UseCardsDataManager {
   isLoading: boolean;
   usersToRender: User[];
   currentUserDisplaying: number;
   attractionsQueue: React.MutableRefObject<Attraction[]>;
   attractionsShouldBeSentReason: { reason: AttractionsSendReason };
   shouldRequestMoreUsersReason: { reason: RequestMoreUsersReason };
   noMoreUsersLeft: boolean;
   moveToNextUser: (currentUserId: string) => void;
   goBackToPreviousUser: (currentUserId: string) => void;
   addAttractionToQueue: (attraction: Attraction) => void;
   removeFromAttractionsQueue: (toRemove: Array<{ userId: string }>) => void;
   /**
    * After calling this the next time new cards are received will be appended into the usersToRender
    * list instead of replacing it. This only applies once so it needs to be called again when needed.
    */
   inNextUpdateAppendNewUsersToRenderList: () => void;
   setAttractionsShouldBeSentReason: Dispatch<SetStateAction<{ reason: AttractionsSendReason }>>;
   setShouldRequestMoreUsersReason: Dispatch<SetStateAction<{ reason: RequestMoreUsersReason }>>;
}

export enum AttractionsSendReason {
   None = "None",
   AttractionsQueueSizeReachedMaximum = "AttractionsQueueSizeReachedMaximum",
   UserMovedToOtherScreen = "UserMovedToOtherScreen",
   AppMinimized = "AppMinimized",
   TooMuchTimePassedWithoutSending = "TooMuchTimePassedWithoutSending",
   PendingAttractionsToSendFromPreviousSession = "PendingAttractionsToSendFromPreviousSession"
}

export enum RequestMoreUsersReason {
   None = "None",
   NearlyRunningOutOfUsers = "NearlyRunningOutOfUsers",
   NoMoreUsersButServerMayHave = "NoMoreUsersButServerMayHave"
}
