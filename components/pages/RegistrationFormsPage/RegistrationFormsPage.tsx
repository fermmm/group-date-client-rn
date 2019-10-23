import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm, { BasicInfoState } from "./BasicInfoForm/BasicInfoForm";
import { NavigationScreenProp, NavigationContainerProps } from "react-navigation";

export interface RegistrationFormsProps extends Themed, NavigationContainerProps { }
export interface RegistrationFormsState {
   currentStep: number;
   showIncompleteError: boolean;
   profileDescription: string;
   basicInfoFormData: BasicInfoState;
   errorToShow: string;
}

class RegistrationFormsPage extends Component<RegistrationFormsProps, RegistrationFormsState> {
   static defaultProps: Partial<RegistrationFormsProps> = {};
   formsCompleted: boolean[] = [];

   state: RegistrationFormsState = {
      currentStep: 0,
      showIncompleteError: false,
      profileDescription: null,
      basicInfoFormData: null,
      errorToShow: "Tenés que completar el formulario",
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;
      const { currentStep, showIncompleteError, profileDescription, errorToShow }: Partial<RegistrationFormsState> = this.state;

      return (
         <>
            <AppBarHeader title={"Nueva cuenta"} />
            <ScreensStepper
               currentScreen={currentStep}
               swipeEnabled={false}
               onScreenChange={(newStep) => this.setState({ currentStep: newStep })}
            >
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.backgroundForText}
                  onContinuePress={() => this.setState({ currentStep: currentStep + 1 })}
                  showContinueButton
               >
                  <ProfileDescriptionForm
                     text={profileDescription}
                     onChange={t => this.setState({profileDescription: t})}
                  />
               </BasicScreenContainer>
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.backgroundForText}
                  onBackPress={() => this.setState({ currentStep: currentStep - 1 })}
                  onContinuePress={() => errorToShow == null ? navigate("Questions") : this.setState({showIncompleteError: true})}
                  showBackButton
                  showContinueButton
               >
                  <BasicInfoForm 
                     onChange={(formData, error) => this.setState({basicInfoFormData: formData, errorToShow: error})}
                  />
               </BasicScreenContainer>
            </ScreensStepper>
            <DialogError
               visible={showIncompleteError}
               onDismiss={() => this.setState({ showIncompleteError: false })}
            >
               {errorToShow}
            </DialogError>
         </>

      );
   }
}

const styles: Styles = StyleSheet.create({

});

export default withTheme(RegistrationFormsPage);