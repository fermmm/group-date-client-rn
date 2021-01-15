import React, { useState, FC, useRef, useCallback, useEffect } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { useServerProfileStatus, useUserPropsMutation } from "../../../api/server/user";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { CenteredMethod, LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
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

export interface ParamsRegistrationFormsPage {
   formsToShow?: RegistrationFormName[];
   themesAsQuestionsToShow?: string[];
}

// TODO: Que al apretar back pregunte si queres guardar o cancelar, tanto con boton como el back nativo

const RegistrationFormsPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsRegistrationFormsPage>>();
   const { navigate, goBack } = useNavigation();
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
   } = useRequiredFormList(profileStatus);
   const showErrorDialog = useCallback(() => setErrorDialogVisible(true), []);
   const hideErrorDialog = useCallback(() => setErrorDialogVisible(false), []);

   const {
      formsToShow: formsToShowFromRoute,
      // TODO: Ademas de llenar este array hay que setear el form name en formsToShow para que muestre la question
      themesAsQuestionsToShow: themesAsQuestionsToShowFromRoute
   } = params ?? {};
   const formsToShow = formsToShowFromRoute ?? formsRequired;

   useEffect(() => {
      if (isFocused && sendingToServer && profileStatus?.user?.profileCompleted) {
         formsToShowFromRoute == null ? navigate("Main") : goBack();
         setSendingToServer(false);
      }
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

      if (currentStep < formsToShow.length - 1) {
         setCurrentStep(currentStep + 1);
      } else {
         sendDataToServer();
      }
   }, [currentStep, formsToShow]);

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
      (): string => errorOnForms.current[formsToShow[currentStep]],
      [formsToShow, currentStep]
   );

   const isLoading: boolean =
      profileStatusLoading ||
      requiredFormListLoading ||
      userMutationLoading ||
      themesMutationLoading ||
      sendingToServer;

   return (
      <>
         <AppBarHeader />
         {isLoading ? (
            <>
               <BasicScreenContainer />
               <LoadingAnimation centeredMethod={CenteredMethod.Absolute} />
            </>
         ) : (
            <ScreensStepper
               currentScreen={currentStep}
               swipeEnabled={false}
               onScreenChange={handleScreenChange}
            >
               {formsToShow.map((formName, i) => (
                  <BasicScreenContainer
                     showBottomGradient={true}
                     onContinuePress={handleContinueButtonClick}
                     onBackPress={handleBackButtonClick}
                     showBackButton={i > 0}
                     continueButtonTextFinishMode={i === formsToShow.length - 1}
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
                           birthDateSelected={propsGathered?.current?.birthDate as number}
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
