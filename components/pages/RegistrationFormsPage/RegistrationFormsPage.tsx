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

export interface RegistrationFormsProps extends Themed { }
export interface RegistrationFormsState {
   currentStep: number;
   showIncompleteError: boolean;
}

class RegistrationFormsPage extends Component<RegistrationFormsProps, RegistrationFormsState> {
   static defaultProps: Partial<RegistrationFormsProps> = {};
   formsCompleted: boolean[] = [];

   state: RegistrationFormsState = {
      currentStep: 0,
      showIncompleteError: false,
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { currentStep, showIncompleteError }: Partial<RegistrationFormsState> = this.state;

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
                  <ProfileDescriptionForm />
               </BasicScreenContainer>
            </ScreensStepper>
            <DialogError
               visible={showIncompleteError}
               onDismiss={() => this.setState({ showIncompleteError: false })}
            >
               Tenés que completar todos los campos para continuar
            </DialogError>
         </>

      );
   }
}

const styles: Styles = StyleSheet.create({

});

export default withTheme(RegistrationFormsPage);