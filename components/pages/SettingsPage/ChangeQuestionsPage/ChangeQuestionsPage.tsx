import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import { StackScreenProps, NavigationScreenProp, withNavigation } from "@react-navigation/stack";
import QuestionsPage from "../../QuestionsPage/QuestionsPage";

export interface ChangeQuestionsPageProps extends Themed, StackScreenProps<{}> {}
export interface ChangeQuestionsPageState {}

class ChangeQuestionsPage extends Component<ChangeQuestionsPageProps, ChangeQuestionsPageState> {
   static defaultProps: Partial<ChangeQuestionsPageProps> = {};

   render(): JSX.Element {
      const { getParam, navigate }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      const startingQuestion: number = getParam("startingQuestion");

      return (
         <QuestionsPage
            appBarTitle={"Modificar preguntas"}
            backButtonChangesPage={true}
            startingQuestion={startingQuestion || 0}
            showBottomButtons={startingQuestion == null}
            onFinishGoBack
         />
      );
   }
}

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(ChangeQuestionsPage));
