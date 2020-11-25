import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";
import ProfilePicturesForm from "../../RegistrationFormsPage/ProfilePicturesForm/ProfilePicturesForm";
import { ThemeExt, Themed } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import DialogError from "../../../common/DialogError/DialogError";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";

export interface ChangePicturesPageProps extends Themed, StackScreenProps<{}> {}
export interface ChangePicturesPageState {
   pictures: string[];
   error: string;
   showError: boolean;
}

class ChangePicturesPage extends Component<ChangePicturesPageProps, ChangePicturesPageState> {
   static defaultProps: Partial<ChangePicturesPageProps> = {};
   state: ChangePicturesPageState = {
      pictures: null,
      error: null,
      showError: false
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;

      return (
         <>
            <AppBarHeader title={"Modificar fotos"} onBackPress={() => this.onBackPress()} />
            <BasicScreenContainer>
               <ProfilePicturesForm
                  onChange={(pictures, error) => this.setState({ pictures, error })}
               />
            </BasicScreenContainer>
            <DialogError
               visible={this.state.showError}
               onDismiss={() => this.setState({ showError: false })}
            >
               {this.state.error}
            </DialogError>
         </>
      );
   }

   onBackPress(): void {
      const { goBack }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      if (this.state.error == null) {
         // Send changes to server here
         goBack();
      } else {
         this.setState({ showError: true });
      }
   }
}

const styles: Styles = StyleSheet.create({});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(ChangePicturesPage));
