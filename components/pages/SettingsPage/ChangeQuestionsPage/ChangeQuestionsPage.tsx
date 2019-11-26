import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import { NavigationInjectedProps, NavigationScreenProp, withNavigation } from "react-navigation";
import QuestionsPage from "../../QuestionsPage/QuestionsPage";

export interface ChangeQuestionsPageProps extends Themed, NavigationInjectedProps { }
export interface ChangeQuestionsPageState { }

class ChangeQuestionsPage extends Component<ChangeQuestionsPageProps, ChangeQuestionsPageState> {
   static defaultProps: Partial<ChangeQuestionsPageProps> = {};

   render(): JSX.Element {
      const { getParam, navigate }: NavigationScreenProp<{}> = this.props.navigation;
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

export default withNavigation(withTheme(ChangeQuestionsPage));