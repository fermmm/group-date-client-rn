import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { StackScreenProps, NavigationScreenProp, withNavigation } from "@react-navigation/stack";
import DialogError from "../../../common/DialogError/DialogError";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import DateIdeaForm, { DateIdeaState } from "../../RegistrationFormsPage/DateIdeaForm/DateIdeaForm";

interface ChangeDateIdeaPageProps extends Themed, StackScreenProps<{}> {}
interface ChangeDateIdeaPageState {
   dateIdeaFormData: DateIdeaState;
   error: string;
   showError: boolean;
}

class ChangeDateIdeaPage extends Component<ChangeDateIdeaPageProps, ChangeDateIdeaPageState> {
   state: ChangeDateIdeaPageState = {
      dateIdeaFormData: null,
      error: null,
      showError: false
   };

   render(): JSX.Element {
      return (
         <>
            <AppBarHeader title={"Modificar idea de cita"} onBackPress={() => this.onBackPress()} />
            <BasicScreenContainer>
               <DateIdeaForm
                  onChange={(data, error) => this.setState({ dateIdeaFormData: data, error })}
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

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(ChangeDateIdeaPage));
