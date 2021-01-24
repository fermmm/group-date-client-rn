import { useLocalStorage } from "./../../../../common-tools/device-native-api/storage/useLocalStorage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEffectExceptOnMount } from "./../../../../common-tools/common-hooks/useEffectExceptoOnMount";
import { Attraction, User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import {
   MAX_USER_EVALUATIONS_QUEUE_SIZE,
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
   const { value: evaluationsFromStorage, setValue: saveOnStorage } = useLocalStorage(
      "_evalQueue",
      true
   );
   const [usersToRender, setUsersToRender] = useState([]);
   const evaluationsQueue = useRef<Attraction[]>([]);
   const appendMode = useRef(false);
   const [
      evaluationsShouldBeSentReason,
      setEvaluationsShouldBeSentReason
   ] = useState<EvaluationShouldBeSentReason>(EvaluationShouldBeSentReason.None);

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
    * Get the evaluations queue from local storage. This is here because the user may have
    * evaluations not sent in previous session. This executes only once because evaluationsFromStorage
    * updates only once (unless refresh() is called after saving but it's not).
    */
   useEffectExceptOnMount(() => {
      if (evaluationsFromStorage != null) {
         evaluationsQueue.current = JSON.parse(evaluationsFromStorage);
         setEvaluationsShouldBeSentReason(
            EvaluationShouldBeSentReason.PendingEvaluationsToSendFromPreviousSession
         );
      }
   }, [evaluationsFromStorage]);

   /**
    * An effect to check whether the evaluations queue should be sent and the reasons
    */
   useEffect(() => {
      // Users to render are depleted but last time server returned users
      if (evaluationsQueue.current.length > MAX_USER_EVALUATIONS_QUEUE_SIZE) {
         setEvaluationsShouldBeSentReason(
            EvaluationShouldBeSentReason.EvaluationsQueueSizeReachedMaximum
         );
         return;
      }

      if (userDisplaying >= usersToRender.length && usersToRender.length > 0) {
         setEvaluationsShouldBeSentReason(EvaluationShouldBeSentReason.NoMoreUsersButServerMayHave);
         return;
      }

      if (userDisplaying > usersToRender.length - 1 - REQUEST_MORE_CARDS_ANTICIPATION) {
         setEvaluationsShouldBeSentReason(EvaluationShouldBeSentReason.NearlyRunningOutOfUsers);
         return;
      }
   }, [userDisplaying]);

   /**
    * An effect to check whether the evaluations queue should be sent based on the section is focused or not
    */
   useEffect(() => {
      if (!isFocused) {
         setEvaluationsShouldBeSentReason(EvaluationShouldBeSentReason.UserMovedToOtherScreen);
      }
   }, [isFocused]);

   /**
    * An effect to check whether the evaluations queue should be sent based on the app is minimized or not
    */
   useEffect(() => {
      if (!isActive) {
         setEvaluationsShouldBeSentReason(EvaluationShouldBeSentReason.AppMinimized);
      }
   }, [isActive]);

   /**
    * An effect to check whether the evaluations queue should be sent based on a time interval
    */
   useInterval(() => {
      setEvaluationsShouldBeSentReason(
         EvaluationShouldBeSentReason.TooMuchTimePassedWithoutSending
      );
   }, REQUEST_MORE_CARDS_AFTER_TIME);

   const addEvaluationToQueue = useCallback((evaluation: Attraction) => {
      evaluationsQueue.current.push(evaluation);
      saveOnStorage(JSON.stringify(evaluationsQueue.current));
   }, []);

   const removeFromEvaluationQueue = useCallback((toRemove: Attraction[]) => {
      evaluationsQueue.current = evaluationsQueue.current.filter(
         el => toRemove.find(tr => tr.userId === el.userId) == null
      );
      saveOnStorage(JSON.stringify(evaluationsQueue.current));
      setEvaluationsShouldBeSentReason(EvaluationShouldBeSentReason.None);
   }, []);

   const appendUsersFromServerInNextUpdate = useCallback(() => {
      appendMode.current = true;
   }, []);

   return {
      usersToRender,
      evaluationsQueue,
      evaluationsShouldBeSentReason,
      addEvaluationToQueue,
      removeFromEvaluationQueue,
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
   evaluationsQueue: React.MutableRefObject<Attraction[]>;
   evaluationsShouldBeSentReason: EvaluationShouldBeSentReason;
   addEvaluationToQueue: (ev: Attraction) => void;
   removeFromEvaluationQueue: (toRemove: Attraction[]) => void;
   appendUsersFromServerInNextUpdate: () => void;
}

export enum EvaluationShouldBeSentReason {
   None = "None",
   NearlyRunningOutOfUsers = "NearlyRunningOutOfUsers",
   NoMoreUsersButServerMayHave = "NoMoreUsersButServerMayHave",
   EvaluationsQueueSizeReachedMaximum = "EvaluationsQueueSizeReachedMaximum",
   UserMovedToOtherScreen = "UserMovedToOtherScreen",
   AppMinimized = "AppMinimized",
   TooMuchTimePassedWithoutSending = "TooMuchTimePassedWithoutSending",
   PendingEvaluationsToSendFromPreviousSession = "PendingEvaluationsToSendFromPreviousSession"
}
