import { useLocalStorage } from "./../../../../common-tools/device-native-api/storage/useLocalStorage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEffectExceptOnMount } from "./../../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Attraction, User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import {
   MAX_ATTRACTIONS_QUEUE_SIZE,
   REQUEST_MORE_CARDS_AFTER_TIME,
   REQUEST_MORE_CARDS_ANTICIPATION
} from "../../../../config";
import { useIsFocused } from "@react-navigation/native";
import { useAppState } from "../../../../common-tools/device-native-api/state/useAppState";
import { useInterval } from "../../../../common-tools/common-hooks/useInterval";

export function useCardsDataManager(
   usersFromServer: User[],
   userDisplaying: number
): UseCardsDataManager {
   const isFocused = useIsFocused();
   const { isActive } = useAppState();
   const { value: attractionsFromStorage, setValue: saveOnStorage } = useLocalStorage("_attrQueue");
   const [usersToRender, setUsersToRender] = useState([]);
   const attractionsQueue = useRef<Attraction[]>([]);
   const appendMode = useRef(false);
   const [
      attractionsShouldBeSentReason,
      setAttractionsShouldBeSentReason
   ] = useState<AttractionsSendReason>(AttractionsSendReason.None);

   /**
    * If more users are coming from server replace usersToRender or add them at the end of it
    */
   useEffectExceptOnMount(() => {
      if (usersFromServer == null) {
         return;
      }

      let newUsersToRender = [];

      if (appendMode.current) {
         newUsersToRender = mergeUsersList(usersToRender, usersFromServer);
         appendMode.current = false;
      } else {
         newUsersToRender = usersFromServer;
      }

      setUsersToRender(newUsersToRender);
   }, [usersFromServer]);

   /**
    * Get the attraction queue from local storage. This is here because the user may have
    * attractions not sent in previous session. This executes only once because
    * attractionsFromStorage updates only once (unless refresh() is called after saving
    * but it's not).
    */
   useEffectExceptOnMount(() => {
      if (attractionsFromStorage != null) {
         attractionsQueue.current = JSON.parse(attractionsFromStorage);
         setAttractionsShouldBeSentReason(
            AttractionsSendReason.PendingAttractionsToSendFromPreviousSession
         );
      }
   }, [attractionsFromStorage]);

   /**
    * An effect to check whether the attractions queue should be sent and the reasons
    */
   useEffect(() => {
      // Users to render are depleted but last time server returned users
      if (attractionsQueue.current.length > MAX_ATTRACTIONS_QUEUE_SIZE) {
         setAttractionsShouldBeSentReason(AttractionsSendReason.AttractionsQueueSizeReachedMaximum);
         return;
      }

      if (userDisplaying >= usersToRender.length && usersToRender.length > 0) {
         setAttractionsShouldBeSentReason(AttractionsSendReason.NoMoreUsersButServerMayHave);
         return;
      }

      if (userDisplaying > usersToRender.length - 1 - REQUEST_MORE_CARDS_ANTICIPATION) {
         setAttractionsShouldBeSentReason(AttractionsSendReason.NearlyRunningOutOfUsers);
         return;
      }
   }, [userDisplaying]);

   /**
    * An effect to check whether the attractions queue should be sent based on the section is focused or not
    */
   useEffect(() => {
      if (!isFocused) {
         setAttractionsShouldBeSentReason(AttractionsSendReason.UserMovedToOtherScreen);
      }
   }, [isFocused]);

   /**
    * An effect to check whether the attractions queue should be sent based on the app is minimized or not
    */
   useEffect(() => {
      if (!isActive) {
         setAttractionsShouldBeSentReason(AttractionsSendReason.AppMinimized);
      }
   }, [isActive]);

   /**
    * An effect to check whether the attractions queue should be sent based on a time interval
    */
   useInterval(() => {
      setAttractionsShouldBeSentReason(AttractionsSendReason.TooMuchTimePassedWithoutSending);
   }, REQUEST_MORE_CARDS_AFTER_TIME);

   const addAttractionToQueue = useCallback((attraction: Attraction) => {
      attractionsQueue.current.push(attraction);
      saveOnStorage(JSON.stringify(attractionsQueue.current));
   }, []);

   const removeFromAttractionsQueue = useCallback((toRemove: Attraction[]) => {
      attractionsQueue.current = attractionsQueue.current.filter(
         el => toRemove.find(tr => tr.userId === el.userId) == null
      );
      saveOnStorage(JSON.stringify(attractionsQueue.current));
      setAttractionsShouldBeSentReason(AttractionsSendReason.None);
   }, []);

   const appendUsersFromServerInNextUpdate = useCallback(() => {
      appendMode.current = true;
   }, []);

   return {
      usersToRender,
      attractionsQueue,
      attractionsShouldBeSentReason,
      addAttractionToQueue,
      removeFromAttractionsQueue,
      appendUsersFromServerInNextUpdate
   };
}

/**
 * Returns a new array where list2 elements are added at the end of list1 elements avoiding duplications.
 */
function mergeUsersList(list1: User[], list2: User[]): User[] {
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

export interface UseCardsDataManager {
   usersToRender: User[];
   attractionsQueue: React.MutableRefObject<Attraction[]>;
   attractionsShouldBeSentReason: AttractionsSendReason;
   addAttractionToQueue: (attraction: Attraction) => void;
   removeFromAttractionsQueue: (toRemove: Attraction[]) => void;
   appendUsersFromServerInNextUpdate: () => void;
}

export enum AttractionsSendReason {
   None = "None",
   NearlyRunningOutOfUsers = "NearlyRunningOutOfUsers",
   NoMoreUsersButServerMayHave = "NoMoreUsersButServerMayHave",
   AttractionsQueueSizeReachedMaximum = "AttractionsQueueSizeReachedMaximum",
   UserMovedToOtherScreen = "UserMovedToOtherScreen",
   AppMinimized = "AppMinimized",
   TooMuchTimePassedWithoutSending = "TooMuchTimePassedWithoutSending",
   PendingAttractionsToSendFromPreviousSession = "PendingAttractionsToSendFromPreviousSession"
}
