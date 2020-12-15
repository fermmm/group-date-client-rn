import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { withNavigation } from "@react-navigation/compat";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "../../RegistrationFormsPage/ProfileDescriptionForm/ProfileDescriptionForm";

export interface ChangeProfileTextProps extends Themed, StackScreenProps<{}> {}
export interface ChangeProfileTextState {
   profileText: string;
}

class ChangeProfileTextPage extends Component<ChangeProfileTextProps, ChangeProfileTextState> {
   state: ChangeProfileTextState = {
      profileText: "" // Retrieve current profile text here
   };

   render(): JSX.Element {
      return (
         <>
            <AppBarHeader title={"Modificar texto libre"} onBackPress={() => this.onBackPress()} />
            <BasicScreenContainer>
               <ProfileDescriptionForm
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
export default withTheme(withNavigation(ChangeProfileTextPage));
