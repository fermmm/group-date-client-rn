import React, { useState, FC, useRef, useCallback, useEffect } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { useServerProfileStatus, useUserPropsMutation } from "../../../api/server/user";
import { useIsFocused, useRoute } from "@react-navigation/native";
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

export interface ParamsRegistrationFormsPage {
   formsToShow?: RegistrationFormName[];
   themesAsQuestionsToShow?: string[];
}

// TODO: Que al apretar back pregunte si queres guardar o cancelar, tanto con boton como el back nativo

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
         <AppBarHeader />
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
