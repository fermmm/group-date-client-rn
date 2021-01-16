import React, { useState, FC, useRef, useCallback, useEffect } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import Dialog from "../../common/Dialog/Dialog";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { useServerProfileStatus, useUserPropsMutation } from "../../../api/server/user";
import { useFocusEffect, useIsFocused, useRoute } from "@react-navigation/native";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { EditableUserProps } from "../../../api/server/shared-tools/validators/user";
import { RegistrationFormName, useRequiredFormList } from "./hooks/useRequiredFormList";
import ProfileImagesForm from "./ProfileImagesForm/ProfileImagesForm";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import PropAsQuestionForm from "./PropAsQuestionForm/PropAsQuestionForm";
import FiltersForm from "./FiltersForm/FiltersForm";
import ThemesAsQuestionForm from "./ThemesAsQuestionForm/ThemesAsQuestionForm";
import { useUnifiedThemesToUpdate } from "./hooks/useUnifiedThemesToUpdate";
import { ThemeEditAction, useThemesMutation } from "../../../api/server/themes";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { BackHandler } from "react-native";
import { objectsContentIsEqual } from "../../../common-tools/js-tools/js-tools";

export interface ParamsRegistrationFormsPage {
   formsToShow?: RegistrationFormName[];
   themesAsQuestionsToShow?: string[];
}

/**
 * This component shows one or more registration forms, is by both the registration process and also when
 * changing the profile. It can receive a list of required forms to show from the params (when modifying
 * profile) or from server (on registration)
 */
const RegistrationFormsPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsRegistrationFormsPage>>();
   const { navigateWithoutHistory, goBack, canGoBack } = useNavigation();
   const isFocused = useIsFocused();
   const [currentStep, setCurrentStep] = useState(0);
   const [errorDialogVisible, setErrorDialogVisible] = useState(false);
   const [exitDialogVisible, setExitDialogVisible] = useState(false);
   const [sendingToServer, setSendingToServer] = useState(false);
   const errorOnForms = useRef<Partial<Record<RegistrationFormName, string>>>({});
   const propsGathered = useRef<EditableUserProps>({});
   const themesToUpdate = useRef<Record<string, ThemesToUpdate>>({});
   const { unifiedThemesToUpdate, questionsShowed } = useUnifiedThemesToUpdate(
      themesToUpdate.current
   );
   const { data: profileStatus, isLoading: profileStatusLoading } = useServerProfileStatus();

   const { mutateAsync: mutateUser, isLoading: userMutationLoading } = useUserPropsMutation();
   const { mutateAsync: mutateThemes, isLoading: themesMutationLoading } = useThemesMutation();
   const {
      isLoading: requiredFormListLoading,
      formsRequired,
      knownFormsWithPropsTheyChange,
      unknownPropsQuestions,
      themesAsQuestionsToShow
   } = useRequiredFormList(
      params != null ? { fromParams: params } : { fromProfileStatus: profileStatus }
   );

   useEffect(() => {
      if (
         isFocused &&
         sendingToServer &&
         (profileStatus?.user?.profileCompleted || params != null)
      ) {
         params == null ? navigateWithoutHistory("Main") : goBack();
      }
   }, [profileStatus]);

   useFocusEffect(
      React.useCallback(() => {
         BackHandler.addEventListener("hardwareBackPress", handleBackButton);
         return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
         };
      }, [])
   );

   const handleChangeOnForm = useCallback(
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

   const showErrorDialog = useCallback(() => setErrorDialogVisible(true), []);
   const hideErrorDialog = useCallback(() => setErrorDialogVisible(false), []);
   const showExitDialog = useCallback(() => setExitDialogVisible(true), []);
   const hideExitDialog = useCallback(() => setExitDialogVisible(false), []);

   // Called when clicking the back button rendered on the bottom of the screen
   const handleBackButtonClick = useCallback(() => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   }, [currentStep]);

   // Called by back button/gesture when there are multiple steps
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   // Called when the back button/gesture on the device is pressed before leaving the screen
   const handleBackButton = useCallback(() => {
      if (canGoBack() && userChangedSomething()) {
         showExitDialog();
      } else {
         if (canGoBack()) {
            goBack();
         }
      }

      return true;
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

   const sendDataToServer = async () => {
      setSendingToServer(true);
      let propsToSend: EditableUserProps = propsGathered.current;

      if (questionsShowed?.length > 0) {
         propsToSend.questionsShowed = questionsShowed;
      }
      if (unifiedThemesToUpdate?.themesToSubscribe?.length > 0) {
         await mutateThemes({
            action: ThemeEditAction.Subscribe,
            themeIds: unifiedThemesToUpdate.themesToSubscribe,
            token: profileStatus.user.token
         });
      }
      if (unifiedThemesToUpdate?.themesToBlock?.length > 0) {
         await mutateThemes({
            action: ThemeEditAction.Block,
            themeIds: unifiedThemesToUpdate.themesToBlock,
            token: profileStatus.user.token
         });
      }
      if (unifiedThemesToUpdate?.themesToUnsubscribe?.length > 0) {
         await mutateThemes({
            action: ThemeEditAction.RemoveSubscription,
            themeIds: unifiedThemesToUpdate.themesToUnsubscribe,
            token: profileStatus.user.token
         });
      }
      if (unifiedThemesToUpdate?.themesToUnblock?.length > 0) {
         await mutateThemes({
            action: ThemeEditAction.RemoveBlock,
            themeIds: unifiedThemesToUpdate.themesToUnblock,
            token: profileStatus.user.token
         });
      }
      // We send user props last because it contains questionsShowed prop, which means that the themes were sent
      if (Object.keys(propsToSend).length > 0) {
         await mutateUser({ token: profileStatus.user.token, props: propsToSend });
      }
   };

   const getCurrentFormError = useCallback(
      (): string => errorOnForms.current[formsRequired[currentStep]],
      [formsRequired, currentStep]
   );

   const userChangedSomething = (): boolean => {
      return !objectsContentIsEqual(propsGathered.current, profileStatus.user, {
         object2CanHaveMoreProps: true
      });
   };

   const isLoading: boolean =
      profileStatus == null ||
      formsRequired?.length === 0 ||
      profileStatusLoading ||
      requiredFormListLoading ||
      userMutationLoading ||
      themesMutationLoading ||
      sendingToServer;

   return (
      <>
         <AppBarHeader onBackPress={handleBackButton} showBackButton={params != null} />
         {isLoading ? (
            <LoadingAnimation renderMethod={RenderMethod.FullScreen} />
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
                     continueButtonTextFinishMode={i === formsRequired.length - 1}
                     showContinueButton
                     key={i}
                  >
                     {formName === "BasicInfoForm" && (
                        <BasicInfoForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "FiltersForm" && (
                        <FiltersForm
                           formName={formName}
                           initialData={profileStatus.user}
                           birthDateSelected={propsGathered?.current?.birthDate as number}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "ProfileImagesForm" && (
                        <ProfileImagesForm
                           formName={formName}
                           initialData={profileStatus.user as User}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "DateIdeaForm" && (
                        <DateIdeaForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "ProfileDescriptionForm" && (
                        <ProfileDescriptionForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "GenderForm" && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "TargetGenderForm" && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           defaultValueForNonSelectedAnswers={false}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {formName === "CoupleProfileForm" && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {unknownPropsQuestions.includes(formName) && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleChangeOnForm}
                        />
                     )}
                     {themesAsQuestionsToShow.includes(formName) && (
                        <ThemesAsQuestionForm
                           formName={formName}
                           questionId={formName}
                           initialData={profileStatus.user}
                           mandatoryQuestion={true}
                           onChange={handleChangeOnForm}
                        />
                     )}
                  </BasicScreenContainer>
               ))}
            </ScreensStepper>
         )}
         <Dialog visible={errorDialogVisible} onDismiss={hideErrorDialog}>
            {getCurrentFormError()}
         </Dialog>
         <Dialog
            visible={exitDialogVisible}
            onDismiss={hideExitDialog}
            buttons={[
               { label: "Descartar", onTouch: goBack },
               { label: "Guardar", onTouch: handleContinueButtonClick }
            ]}
         >
            ¿Guardar cambios?
         </Dialog>
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
