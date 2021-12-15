import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useGroup } from "../../../api/server/groups";
import { setSeen, setTaskAsCompleted, useUser } from "../../../api/server/user";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { useCustomBackButtonAction } from "../../../common-tools/device-native-api/hardware-buttons/useCustomBackButtonAction";
import { useDialogModal } from "../../common/DialogModal/tools/useDialogModal";
import QuestionToRemoveSeen from "./QuestionToRemoveSeen/QuestionToRemoveSeen";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useShouldRedirectToRequiredPage } from "../../../common-tools/navigation/useShouldRedirectToRequiredPage";
import {
   SetSeenAction,
   TaskType
} from "../../../api/server/shared-tools/endpoints-interfaces/user";

export interface ParamsRemoveSeenWizardPage {
   groupId: string;
}

const RemoveSeenWizardPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsRemoveSeenWizardPage>>();
   const { groupId } = params;
   const { openDialogModal } = useDialogModal();
   const { navigateWithoutHistory } = useNavigation();
   const { data: group, isLoading: groupLoading } = useGroup({ groupId });
   const { data: user, isLoading: userLoading } = useUser();
   const [currentMemberDisplaying, setCurrentMemberDisplaying] = useState(0);
   const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
   const [sendingAnswers, setSendingAnswers] = useState<boolean>(false);
   // With this we get the info required to know where to redirect on finish
   const { shouldRedirectToRequiredPage, redirectToRequiredPage, shouldRedirectIsLoading } =
      useShouldRedirectToRequiredPage();
   const membersToRender = group?.matches
      ?.filter(match => match.matches.includes(user?.userId))
      .map(match => match.userId);

   const isLoading = groupLoading || userLoading || shouldRedirectIsLoading || sendingAnswers;

   useCustomBackButtonAction(() => {
      if (currentMemberDisplaying === 0) {
         openDialogModal({
            message: "Debes responder estas preguntas para continuar usando la app"
         });
      } else {
         setCurrentMemberDisplaying(currentMemberDisplaying - 1);
      }
      return true;
   }, [currentMemberDisplaying]);

   const onTopBarBackButtonPress = () => {
      if (currentMemberDisplaying === 0) {
         return;
      }

      setCurrentMemberDisplaying(currentMemberDisplaying - 1);
   };

   const handleAnswer = (include: boolean, userId: string) => {
      setAnswers({ ...answers, [userId]: include });
      if (currentMemberDisplaying < membersToRender?.length - 1) {
         setCurrentMemberDisplaying(currentMemberDisplaying + 1);
      } else {
         onFinish();
      }
   };

   const onFinish = async () => {
      setSendingAnswers(true);
      const usersToRemoveSeen = Object.keys(answers).filter(userId => answers[userId] === true);
      const response = await setSeen({
         token: user.token,
         setSeenActions: usersToRemoveSeen.map(targetUserId => ({
            targetUserId,
            action: SetSeenAction.RequestRemoveSeen
         }))
      });

      if (!response?.success) {
         setSendingAnswers(false);
         return;
      }

      const taskToRemove = user.requiredTasks.find(
         task => task.type === TaskType.ShowRemoveSeenMenu && task.taskInfo === groupId
      );

      if (taskToRemove) {
         const taskCompletedResponse = await setTaskAsCompleted({
            token: user.token,
            taskId: taskToRemove.taskId
         });

         if (!taskCompletedResponse?.success) {
            setSendingAnswers(false);
            return;
         }
      }

      setSendingAnswers(false);
      if (shouldRedirectToRequiredPage) {
         redirectToRequiredPage();
      } else {
         navigateWithoutHistory("Main");
      }
   };

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <AppBarHeader
            showBackButton={currentMemberDisplaying > 0}
            onBackPress={onTopBarBackButtonPress}
         />
         <View style={styles.mainContainer}>
            <LimitedChildrenRenderer childToFocus={currentMemberDisplaying}>
               {membersToRender.map(userId => (
                  <QuestionToRemoveSeen
                     userId={userId}
                     onAnswer={answer => handleAnswer(answer, userId)}
                     key={userId + currentMemberDisplaying}
                  />
               ))}
            </LimitedChildrenRenderer>
         </View>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1
   }
});

export default RemoveSeenWizardPage;
