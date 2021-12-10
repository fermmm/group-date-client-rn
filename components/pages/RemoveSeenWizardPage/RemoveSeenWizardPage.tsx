import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import LimitedChildrenRenderer from "../../common/LimitedChildrenRenderer/LimitedChildrenRenderer";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useGroup } from "../../../api/server/groups";
import { useUser } from "../../../api/server/user";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { useCustomBackButtonAction } from "../../../common-tools/device-native-api/hardware-buttons/useCustomBackButtonAction";
import { useDialogModal } from "../../common/DialogModal/tools/useDialogModal";
import QuestionToRemoveSeen from "./QuestionToRemoveSeen/QuestionToRemoveSeen";

export interface ParamsRemoveSeenWizardPage {
   groupId: string;
}

const RemoveSeenWizardPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsRemoveSeenWizardPage>>();
   const { groupId } = params;
   const { openDialogModal } = useDialogModal();
   const { data: group, isLoading: groupLoading } = useGroup({ groupId });
   const { data: user, isLoading: userLoading } = useUser();
   const [currentMemberDisplaying, setCurrentMemberDisplaying] = useState(0);
   const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
   const membersToRender = group?.matches
      ?.filter(match => match.matches.includes(user?.userId))
      .map(match => match.userId);

   const isLoading = groupLoading || userLoading;

   useCustomBackButtonAction(() => {
      if (currentMemberDisplaying === 0) {
         openDialogModal({
            message: "Debes completar estas preguntas para continuar usando la app"
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
         openDialogModal({ message: "Completado" });
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
