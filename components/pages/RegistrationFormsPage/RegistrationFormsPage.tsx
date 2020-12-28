import React, { useState, FC, useRef, useCallback } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { StackNavigationProp } from "@react-navigation/stack";
import { useServerProfileStatus } from "../../../api/server/user";
import { useNavigation } from "@react-navigation/native";
import { CenteredMethod, LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { EditableUserProps } from "../../../api/server/shared-tools/validators/user";
import { RegistrationFormName, useRequiredFormList } from "./hooks/useRequiredScreensList";
import ProfileImagesForm from "./ProfileImagesForm/ProfileImagesForm";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import PropAsQuestionForm from "../../common/PropAsQuestionForm/PropAsQuestionForm";
import FiltersForm from "./FiltersForm/FiltersForm";

// TODO: En useRequiredFormList deberiamos devolver una variable mas: unknownPropsRequired,
// se puede meter en el mismo map

// TODO: Implementar themes as questions

const RegistrationFormsPage: FC = () => {
   const { navigate }: StackNavigationProp<Record<string, {}>> = useNavigation();
   const [currentStep, setCurrentStep] = useState(0);
   const [errorDialogVisible, setErrorDialogVisible] = useState(false);
   const errorOnForms = useRef<Partial<Record<RegistrationFormName, string>>>({});
   const propsGathered = useRef<EditableUserProps>({});
   const { data: profileStatus, isLoading: profileStatusLoading } = useServerProfileStatus();
   const { formsRequired, formsRequiredWithPropsToChange } = useRequiredFormList(profileStatus);

   const handleFormChange = useCallback(
      (formName: RegistrationFormName, newProps: EditableUserProps, error: string | null) => {
         propsGathered.current = { ...propsGathered.current, ...newProps };
         errorOnForms.current[formName] = error;
      },
      []
   );

   const handleContinueButtonClick = useCallback(() => {
      if (getCurrentFormError()) {
         showErrorDialog();
         return;
      }

      if (currentStep < formsRequired.length - 1) {
         setCurrentStep(currentStep + 1);
      } else {
         // TODO:
         // Enviar los datos
         // Como es el ultimo invalida el cache de profile status
         // Si profile status esta ok vamos a la siguiente pantalla (Configurable via props)
      }
   }, [currentStep, formsRequired]);

   const showErrorDialog = useCallback(() => setErrorDialogVisible(true), []);
   const hideErrorDialog = useCallback(() => setErrorDialogVisible(false), []);

   const handleBackButtonClick = useCallback(() => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   }, [currentStep]);

   // Called by back button/gesture on android
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   const getCurrentFormError = useCallback(
      (): string => errorOnForms.current[formsRequired[currentStep]],
      [formsRequired, currentStep]
   );

   return (
      <>
         <AppBarHeader />
         {profileStatusLoading ? (
            <>
               <BasicScreenContainer />
               <LoadingAnimation centeredMethod={CenteredMethod.Relative} visible />
            </>
         ) : (
            <ScreensStepper
               currentScreen={currentStep}
               swipeEnabled={false}
               onScreenChange={handleScreenChange}
            >
               {formsRequired.map((formName, i) => (
                  <BasicScreenContainer
                     showBottomGradient={true}
                     onContinuePress={handleContinueButtonClick}
                     onBackPress={handleBackButtonClick}
                     showBackButton={i > 0}
                     showContinueButton
                     key={formName}
                  >
                     {formName === "BasicInfoForm" && (
                        <BasicInfoForm
                           formName={"BasicInfoForm"}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "FiltersForm" && (
                        <FiltersForm
                           formName={"FiltersForm"}
                           initialData={profileStatus.user}
                           ageSelected={propsGathered?.current?.age as number}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "ProfileImagesForm" && (
                        <ProfileImagesForm
                           formName={"ProfileImagesForm"}
                           initialData={profileStatus.user as User}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "DateIdeaForm" && (
                        <DateIdeaForm
                           formName={"DateIdeaForm"}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "ProfileDescriptionForm" && (
                        <ProfileDescriptionForm
                           formName={"ProfileDescriptionForm"}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "GenderForm" && (
                        <PropAsQuestionForm
                           formName={"GenderForm"}
                           propNamesToChange={formsRequiredWithPropsToChange["GenderForm"]}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "TargetGenderForm" && (
                        <PropAsQuestionForm
                           formName={"TargetGenderForm"}
                           propNamesToChange={formsRequiredWithPropsToChange["TargetGenderForm"]}
                           defaultValueForNonSelectedAnswers={false}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "CoupleProfileForm" && (
                        <PropAsQuestionForm
                           formName={"CoupleProfileForm"}
                           propNamesToChange={formsRequiredWithPropsToChange["CoupleProfileForm"]}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                  </BasicScreenContainer>
               ))}
            </ScreensStepper>
         )}
         <DialogError visible={errorDialogVisible} onDismiss={hideErrorDialog}>
            {getCurrentFormError()}
         </DialogError>
      </>
   );
};

export default RegistrationFormsPage;
