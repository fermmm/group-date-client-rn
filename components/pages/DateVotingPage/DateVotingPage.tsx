import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import VotingPoll, { VoteSubject } from "../../common/VotingPoll/VotingPoll";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { ParamsGroupPage } from "../GroupPage/GroupPage";

export interface DateVotingPageParams {
   group: Group;
}

const DateVotingPage: FC = () => {
   const [currentStep, setCurrentStep] = useState<number>(0);
   const { colors } = useTheme();
   const { goBack } = useNavigation();
   const { params } = useRoute<RouteProps<ParamsGroupPage>>();
   const group: Group = params?.group;

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
                  Vota dia y hora de la cita, después toca "continuar"
               </TitleText>
               <TitleSmallText style={styles.titleSmall}>
                  Puedes votar por más de una opción.
               </TitleSmallText>
               <VotingPoll
                  group={group}
                  subject={VoteSubject.Date}
                  onDayOptionVote={() => console.log("pressed")}
                  onIdeaVote={() => console.log("pressed")}
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
                  Votá el lugar de la cita
               </TitleText>
               <TitleSmallText style={styles.titleSmall}>
                  Estas son todas las opciones recomendadas de todos los miembros del grupo. Podés
                  votar por más de una opción.
               </TitleSmallText>
               <VotingPoll
                  group={group}
                  subject={VoteSubject.Idea}
                  onDayOptionVote={() => console.log("pressed")}
                  onIdeaVote={() => console.log("pressed")}
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
