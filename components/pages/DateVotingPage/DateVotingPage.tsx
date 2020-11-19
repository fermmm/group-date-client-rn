import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import VotingPoll from "../../common/VotingPoll/VotingPoll";
import { Group } from "../../../api/typings/Group";
import { NavigationScreenProp, withNavigation, StackScreenProps } from "@react-navigation/stack";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import {
   testingDayVotingData,
   testingLocationVotingData
} from "../../../api/tools/debug-tools/testingFakeData";

export interface GroupEnterProps extends Themed, StackScreenProps<{}> {}
export interface GroupEnterState {
   currentStep: number;
}

class GroupEnterForm extends Component<GroupEnterProps, GroupEnterState> {
   static defaultProps: Partial<GroupEnterProps> = {};
   state: GroupEnterState = {
      currentStep: 0
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;
      const { getParam, goBack }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      const group: Group = getParam("group");

      return (
         <>
            <AppBarHeader />
            <ScreensStepper
               currentScreen={this.state.currentStep}
               swipeEnabled={false}
               onScreenChange={newStep => this.setState({ currentStep: newStep })}
            >
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onContinuePress={() => this.setState({ currentStep: 1 })}
                  showContinueButton
               >
                  <TitleText extraMarginLeft extraSize>
                     Votá el dia y la hora de la cita, despues toca "continuar"
                  </TitleText>
                  <TitleSmallText style={styles.titleSmall}>
                     Estos son los dias y horas en los que todos pueden, o la mayoría. Podes votar
                     por más de una opción.
                  </TitleSmallText>
                  <VotingPoll group={group} votingOptions={testingDayVotingData} />
               </BasicScreenContainer>
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onBackPress={() => this.setState({ currentStep: 0 })}
                  onContinuePress={() => goBack()}
                  showBackButton
                  showContinueButton
               >
                  <TitleText extraMarginLeft extraSize>
                     Votá el lugar de la cita
                  </TitleText>
                  <TitleSmallText style={styles.titleSmall}>
                     Estas son todas las opciones recomendadas de todos los miembros del grupo.
                     Podés votar por más de una opción.
                  </TitleSmallText>
                  <VotingPoll group={group} votingOptions={testingLocationVotingData} />
               </BasicScreenContainer>
            </ScreensStepper>
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   titleSmall: {
      marginBottom: 20
   }
});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(GroupEnterForm));
