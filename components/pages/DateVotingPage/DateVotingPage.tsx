import React, { FC, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import VotingPoll, { VoteChange } from "../../common/VotingPoll/VotingPoll";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { ParamsGroupPage } from "../GroupPage/GroupPage";
import { useGroupVotingOptions } from "./tools/useGroupVotingOptions";
import { useUser } from "../../../api/server/user";
import { sendDayVotes, sendIdeasVotes, useGroup } from "../../../api/server/groups";
import { mutateGroupCacheDayVote, mutateGroupCacheIdeaVote } from "./tools/groupCacheMutators";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { revalidate } from "../../../api/tools/useCache";

export interface DateVotingPageParams {
   group: Group;
}

const DateVotingPage: FC = () => {
   const [currentStep, setCurrentStep] = useState<number>(0);
   const { colors } = useTheme();
   const { goBack } = useNavigation();
   const { data: user } = useUser();
   const { token } = useFacebookToken();
   const { params } = useRoute<RouteProps<ParamsGroupPage>>();
   const { data: group } = useGroup({ groupId: params?.group?.groupId });
   const votingOptions = useGroupVotingOptions(group);
   const daysToVoteGathered = useRef<number[]>(null);
   const ideasToVoteGathered = useRef<string[]>(null);

   const handleDayVoteChange = (daysToVote: number[], specificChange: VoteChange) => {
      mutateGroupCacheDayVote(specificChange, user.userId, group);
      daysToVoteGathered.current = daysToVote;
   };

   const handleIdeaVoteChange = (ideasToVoteAuthorsIds: string[], specificChange: VoteChange) => {
      mutateGroupCacheIdeaVote(specificChange, user.userId, group);
      ideasToVoteGathered.current = ideasToVoteAuthorsIds;
   };

   // This effect sends the changes to the server once the user leaves the voting page
   useFocusEffect(
      React.useCallback(() => {
         return () => {
            if (daysToVoteGathered.current != null) {
               sendDayVotes(
                  {
                     daysToVote: daysToVoteGathered.current,
                     token,
                     groupId: group.groupId
                  },
                  false
               );
            }

            if (ideasToVoteGathered.current != null) {
               sendIdeasVotes(
                  {
                     ideasToVoteAuthorsIds: ideasToVoteGathered.current,
                     token,
                     groupId: group.groupId
                  },
                  false
               );
            }

            if (daysToVoteGathered.current != null || ideasToVoteGathered.current != null) {
               revalidate("group/votes/result" + group.groupId);
            }
         };
      }, [token])
   );

   if (group == null) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <AppBarHeader />
         <ScreensStepper
            currentScreen={currentStep}
            swipeEnabled={false}
            onScreenChange={newStep => setCurrentStep(newStep)}
         >
            <BasicScreenContainer
               showBottomGradient={true}
               bottomGradientColor={colors.background}
               onContinuePress={() => setCurrentStep(1)}
               showContinueButton
            >
               <TitleText extraMarginLeft extraSize>
                  Vota el día para la cita, después toca "continuar"
               </TitleText>
               <TitleSmallText style={styles.titleSmall}>
                  Puedes votar por más de una opción.
               </TitleSmallText>
               <VotingPoll
                  votingOptions={votingOptions?.dayOptions}
                  potentialVoters={group.members}
                  userId={user.userId}
                  onVoteChange={handleDayVoteChange}
               />
            </BasicScreenContainer>
            <BasicScreenContainer
               showBottomGradient={true}
               bottomGradientColor={colors.background}
               onBackPress={() => setCurrentStep(0)}
               onContinuePress={() => goBack()}
               showBackButton
               showContinueButton
            >
               <TitleText extraMarginLeft extraSize>
                  Vota la idea de la cita
               </TitleText>
               <TitleSmallText style={styles.titleSmall}>
                  Estas son las recomendaciones escritas por los demás del grupo, puedes votar más
                  de una opción
               </TitleSmallText>
               <VotingPoll
                  votingOptions={votingOptions?.ideaOptions}
                  potentialVoters={group.members}
                  userId={user.userId}
                  onVoteChange={handleIdeaVoteChange}
               />
            </BasicScreenContainer>
         </ScreensStepper>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   titleSmall: {
      marginBottom: 20
   }
});

export default DateVotingPage;
