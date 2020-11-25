import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import QuestionsPage from "../../QuestionsPage/QuestionsPage";
import { Route } from "@react-navigation/native";

export interface ChangeQuestionsPageProps extends Themed, StackScreenProps<{}> {}
export interface ChangeQuestionsPageState {}
interface RouteParams {
   startingQuestion: number;
}

class ChangeQuestionsPage extends Component<ChangeQuestionsPageProps, ChangeQuestionsPageState> {
   static defaultProps: Partial<ChangeQuestionsPageProps> = {};
   route: Route<string, RouteParams> = this.props.route as Route<string, RouteParams>;

   render(): JSX.Element {
      const { navigate }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      const { startingQuestion }: RouteParams = this.route.params;

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
