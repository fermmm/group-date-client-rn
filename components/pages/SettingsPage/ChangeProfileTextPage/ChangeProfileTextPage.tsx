import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { StackScreenProps, NavigationScreenProp, withNavigation } from "@react-navigation/stack";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import ProfileTextForm from "../../RegistrationFormsPage/ProfileTextForm/ProfileTextForm";

export interface ChangeProfileTextProps extends Themed, StackScreenProps<{}> {}
export interface ChangeProfileTextState {
   profileText: string;
}

class ChangeProfileTextPage extends Component<ChangeProfileTextProps, ChangeProfileTextState> {
   state: ChangeProfileTextState = {
      profileText: "" // Retreive current profile text here
   };

   render(): JSX.Element {
      return (
         <>
            <AppBarHeader title={"Modificar texto libre"} onBackPress={() => this.onBackPress()} />
            <BasicScreenContainer>
               <ProfileTextForm
                  text={this.state.profileText}
                  onChange={t => this.setState({ profileText: t })}
               />
            </BasicScreenContainer>
         </>
      );
   }

   onBackPress(): void {
      const { goBack }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      // Send changes to server here
      goBack();
   }
}

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(ChangeProfileTextPage));
