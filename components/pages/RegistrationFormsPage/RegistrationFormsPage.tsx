import React, { useState, FC, useRef, useCallback, useEffect } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { useServerProfileStatus, useUserPropsMutation } from "../../../api/server/user";
import { useNavigation } from "@react-navigation/native";
import { CenteredMethod, LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import { EditableUserProps } from "../../../api/server/shared-tools/validators/user";
import { RegistrationFormName, useRequiredFormList } from "./hooks/useRequiredFormList";
import ProfileImagesForm from "./ProfileImagesForm/ProfileImagesForm";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import PropAsQuestionForm from "./PropAsQuestionForm/PropAsQuestionForm";
import FiltersForm from "./FiltersForm/FiltersForm";
import ThemesAsQuestionForm from "./ThemesAsQuestionForm/ThemesAsQuestionForm";
import { useUnifiedThemesToUpdate } from "./hooks/useUnifiedThemesToUpdate";

const RegistrationFormsPage: FC = () => {
   const { navigate } = useNavigation();
   const [currentStep, setCurrentStep] = useState(0);
   const [errorDialogVisible, setErrorDialogVisible] = useState(false);
   const errorOnForms = useRef<Partial<Record<RegistrationFormName, string>>>({});
   const propsGathered = useRef<EditableUserProps>({});
   const themesToUpdate = useRef<Record<string, ThemesToUpdate>>({});
   const unifiedThemesToUpdate = useUnifiedThemesToUpdate(themesToUpdate.current);
   const { data: profileStatus, isLoading: profileStatusLoading } = useServerProfileStatus();
   const { mutate: mutateUser } = useUserPropsMutation();

   const {
      isLoading: requiredFormListLoading,
      formsRequired,
      knownFormsWithPropsTheyChange,
      unknownPropsQuestions,
      themesAsQuestionsToShow
   } = useRequiredFormList(profileStatus);

   const showErrorDialog = useCallback(() => setErrorDialogVisible(true), []);
   const hideErrorDialog = useCallback(() => setErrorDialogVisible(false), []);

   // TODO: Aca si el profile statis esta ok deberiamos movernos a la siguiente pantalla
   useEffect(() => {
      console.log("NEW PROFILE STATUS:");
      console.log(profileStatus);
   }, [profileStatus]);

   const handleFormChange = useCallback(
      (
         formName: RegistrationFormName | string,
         newProps: EditableUserProps,
         error: string | null,
         themesToUpdateReceived?: ThemesToUpdate
      ) => {
         propsGathered.current = { ...propsGathered.current, ...newProps };
         errorOnForms.current[formName] = error;
         if (themesToUpdateReceived != null) {
            themesToUpdate.current[formName] = themesToUpdateReceived;
         }
      },
      []
   );

   const handleBackButtonClick = useCallback(() => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   }, [currentStep]);

   // Called by back button/gesture on android
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   const handleContinueButtonClick = useCallback(() => {
      if (getCurrentFormError()) {
         showErrorDialog();
         return;
      }

      if (currentStep < formsRequired.length - 1) {
         setCurrentStep(currentStep + 1);
      } else {
         sendDataToServer();
      }
   }, [currentStep, formsRequired]);

   const sendDataToServer = () => {
      mutateUser({ token: profileStatus.user.token, props: propsGathered.current });
   };

   const getCurrentFormError = useCallback(
      (): string => errorOnForms.current[formsRequired[currentStep]],
      [formsRequired, currentStep]
   );

   return (
      <>
         <AppBarHeader />
         {profileStatusLoading || requiredFormListLoading ? (
            <>
               <BasicScreenContainer />
               <LoadingAnimation centeredMethod={CenteredMethod.Absolute} visible />
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
                     key={i}
                  >
                     {formName === "BasicInfoForm" && (
                        <BasicInfoForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "FiltersForm" && (
                        <FiltersForm
                           formName={formName}
                           initialData={profileStatus.user}
                           ageSelected={propsGathered?.current?.age as number}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "ProfileImagesForm" && (
                        <ProfileImagesForm
                           formName={formName}
                           initialData={profileStatus.user as User}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "DateIdeaForm" && (
                        <DateIdeaForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "ProfileDescriptionForm" && (
                        <ProfileDescriptionForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "GenderForm" && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "TargetGenderForm" && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           defaultValueForNonSelectedAnswers={false}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {formName === "CoupleProfileForm" && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {unknownPropsQuestions.includes(formName) && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleFormChange}
                        />
                     )}
                     {themesAsQuestionsToShow.includes(formName) && (
                        <ThemesAsQuestionForm
                           formName={formName}
                           questionId={formName}
                           initialData={profileStatus.user}
                           mandatoryQuestion={true}
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

export interface ThemesToUpdate {
   themesToUnsubscribe?: string[];
   themesToSubscribe?: string[];
   themesToBlock?: string[];
   themesToUnblock?: string[];
}

export default RegistrationFormsPage;
