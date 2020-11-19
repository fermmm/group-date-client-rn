import React, { Component } from "react";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import { StackScreenProps, NavigationScreenProp, withNavigation } from "@react-navigation/stack";
import DialogError from "../../../common/DialogError/DialogError";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import BasicInfoForm, {
   BasicInfoState
} from "../../RegistrationFormsPage/BasicInfoForm/BasicInfoForm";

interface ChangeBasicInfoPageProps extends Themed, StackScreenProps<{}> {}
interface ChnageBasicInfoPageState {
   basicInfoFormData: BasicInfoState;
   error: string;
   showError: boolean;
}

class ChangeBasicInfoPage extends Component<ChangeBasicInfoPageProps, ChnageBasicInfoPageState> {
   static defaultProps: Partial<ChangeBasicInfoPageProps> = {};
   state: ChnageBasicInfoPageState = {
      basicInfoFormData: null,
      error: null,
      showError: false
   };

   render(): JSX.Element {
      return (
         <>
            <AppBarHeader
               title={"Modificar datos básicos"}
               onBackPress={() => this.onBackPress()}
            />
            <BasicScreenContainer>
               <BasicInfoForm
                  onChange={(formData, error) =>
                     this.setState({ basicInfoFormData: formData, error })
                  }
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
export default withNavigation(withTheme(ChangeBasicInfoPage));
