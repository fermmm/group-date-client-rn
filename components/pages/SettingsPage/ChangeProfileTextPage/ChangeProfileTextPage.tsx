import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { NavigationInjectedProps, NavigationScreenProp, withNavigation } from "react-navigation";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import ProfileTextForm from "../../RegistrationFormsPage/ProfileTextForm/ProfileTextForm";

export interface ChangeProfileTextProps extends Themed, NavigationInjectedProps { }
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
      const { goBack }: NavigationScreenProp<{}> = this.props.navigation;
      // Send changes to server here
      goBack();
   }
}

export default withNavigation(withTheme(ChangeProfileTextPage));