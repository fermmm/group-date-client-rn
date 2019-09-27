import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import VotingPoll from "../../common/VotingPoll/VotingPoll";
import { Group } from "../../../server-api/typings/Group";
import { NavigationScreenProp, NavigationContainerProps } from "react-navigation";
import { testingLocationVotingData, testingDayVotingData } from "../../../server-api/testingFakeData";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";

export interface VotingPageProps extends Themed, NavigationContainerProps { }
export interface VotingPageState { 
   currentStep: number;
}

class VotingPage extends Component<VotingPageProps, VotingPageState> {
   static defaultProps: Partial<VotingPageProps> = {};
   state: VotingPageState = {
      currentStep: 0
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { getParam }: NavigationScreenProp<{}> = this.props.navigation;
      const group: Group = getParam("group");

      return (
         <>
            <AppBarHeader />
            <ScreensStepper
               currentScreen={this.state.currentStep}
               swipeEnabled={false}
               onScreenChange={(newStep) => this.setState({currentStep: newStep})}
            >
               <BasicScreenContainer 
                  showBottomGradient={true}
                  bottomGradientColor={colors.backgroundForText}
                  onContinuePress={() => this.setState({currentStep: 1})}
                  showContinueButton
               >
                  <TitleText>
                     Votá el dia y la hora de la cita, despues toca "continuar"
                  </TitleText>
                  <TitleSmallText>
                     Estos son los dias y horas en los que todos pueden (o la mayoría)
                  </TitleSmallText>
                  <VotingPoll
                     group={group}
                     votingOptions={testingDayVotingData}
                  />
               </BasicScreenContainer>
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.backgroundForText}
                  onBackPress={() => this.setState({currentStep: 0})}
                  showBackButton
                  showContinueButton
               >
                  <TitleText>
                     Votá el lugar de la cita
                  </TitleText>
                  <TitleSmallText>
                     Estas son todas las opciones recomendadas de todos los miembros del grupo
                  </TitleSmallText>
                  <VotingPoll
                     group={group}
                     votingOptions={testingLocationVotingData}
                  />
               </BasicScreenContainer>
            </ScreensStepper>
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
   },
});

export default withTheme(VotingPage);
