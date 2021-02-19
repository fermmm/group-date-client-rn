import React, { useState, FC, useRef, useCallback, useEffect } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import Dialog from "../../common/Dialog/Dialog";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { sendUserProps, useServerProfileStatus } from "../../../api/server/user";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import {
   EditableUserPropKey,
   EditableUserProps
} from "../../../api/server/shared-tools/validators/user";
import { RegistrationFormName, useRequiredFormList } from "./tools/useRequiredFormList";
import ProfileImagesForm from "./ProfileImagesForm/ProfileImagesForm";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import PropAsQuestionForm from "./PropAsQuestionForm/PropAsQuestionForm";
import FiltersForm from "./FiltersForm/FiltersForm";
import ThemesAsQuestionForm from "./ThemesAsQuestionForm/ThemesAsQuestionForm";
import { useUnifiedThemesToUpdate } from "./tools/useUnifiedThemesToUpdate";
import { sendThemes, ThemeEditAction } from "../../../api/server/themes";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { BackHandler } from "react-native";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import { mutateCache, revalidate } from "../../../api/tools/useCache";
import { filterNotReallyChangedProps } from "./tools/filterNotReallyChangedProps";

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
   const { navigateWithoutHistory, goBack, canGoBack, isFocused } = useNavigation();
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
   const { data: profileStatus } = useServerProfileStatus();
   const {
      isLoading: requiredFormListLoading,
      formsRequired,
      knownFormsWithPropsTheyChange,
      unknownPropsQuestions,
      themesAsQuestionsToShow
   } = useRequiredFormList(
      params != null ? { fromParams: params } : { fromProfileStatus: profileStatus }
   );
   const { token } = useFacebookToken(profileStatus?.user?.token);

   useEffect(() => {
      if (profileStatus?.user != null && sendingToServer) {
         mutateCache("user", profileStatus.user);
      }

      if (
         isFocused() &&
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
         propsGathered.current = {
            ...propsGathered.current,
            ...newProps
         };
         propsGathered.current = filterNotReallyChangedProps(
            propsGathered.current,
            profileStatus?.user
         );
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
      if (canGoBack() && Object.keys(propsGathered.current).length > 0 && isFocused()) {
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
         if (userChangedSomething(propsGathered.current, unifiedThemesToUpdate, questionsShowed)) {
            sendDataToServer();
         } else {
            if (canGoBack()) {
               goBack();
            }
         }
      }
   }, [currentStep, formsRequired, propsGathered.current, unifiedThemesToUpdate, questionsShowed]);

   const sendDataToServer = async () => {
      let propsToSend: EditableUserProps = propsGathered.current;
      let themesWereChanged: boolean = false;

      if (questionsShowed?.length > 0) {
         propsToSend.questionsShowed = questionsShowed;
      }
      if ((propsToSend?.name as string)?.endsWith(" ")) {
         propsToSend.name = (propsToSend.name as string).slice(0, -1);
      }

      if (unifiedThemesToUpdate?.themesToSubscribe?.length > 0) {
         setSendingToServer(true);
         themesWereChanged = true;
         await sendThemes({
            action: ThemeEditAction.Subscribe,
            themeIds: unifiedThemesToUpdate.themesToSubscribe,
            token
         });
      }
      if (unifiedThemesToUpdate?.themesToBlock?.length > 0) {
         setSendingToServer(true);
         themesWereChanged = true;
         await sendThemes({
            action: ThemeEditAction.Block,
            themeIds: unifiedThemesToUpdate.themesToBlock,
            token
         });
      }
      if (unifiedThemesToUpdate?.themesToUnsubscribe?.length > 0) {
         setSendingToServer(true);
         themesWereChanged = true;
         await sendThemes({
            action: ThemeEditAction.RemoveSubscription,
            themeIds: unifiedThemesToUpdate.themesToUnsubscribe,
            token
         });
      }

      if (unifiedThemesToUpdate?.themesToUnblock?.length > 0) {
         setSendingToServer(true);
         themesWereChanged = true;
         await sendThemes({
            action: ThemeEditAction.RemoveBlock,
            themeIds: unifiedThemesToUpdate.themesToUnblock,
            token
         });
      }

      // We send user props last because it contains questionsShowed prop, which means that the themes were sent
      if (Object.keys(propsToSend).length > 0) {
         setSendingToServer(true);
         mutateCache("user", { ...(profileStatus?.user ?? {}), ...propsToSend });
         await sendUserProps({ token, props: propsToSend }, false);
         revalidate("user/profile-status");
      }

      /**
       * Check if the user changed a prop that affects cards recommendation, in that case invalidate the query
       */
      const recommendationsRelatedKeys: EditableUserPropKey[] = [
         "gender",
         "likesMan",
         "likesWoman",
         "likesManTrans",
         "likesWomanTrans",
         "likesOtherGenders",
         "targetDistance",
         "targetAgeMin",
         "targetAgeMax",
         "birthDate"
      ];
      const keysMutated = Object.keys(propsToSend) as EditableUserPropKey[];
      const recommendationsRelatedChanges = keysMutated.filter(key =>
         recommendationsRelatedKeys.includes(key)
      );
      if (recommendationsRelatedChanges.length > 0 || themesWereChanged) {
         revalidate("cards-game/recommendations");
      }
   };

   const userChangedSomething = (
      propsToSend: EditableUserProps,
      unifiedThemesToUpdate: ThemesToUpdate,
      questionsShowed: string[]
   ) => {
      return (
         questionsShowed?.length > 0 ||
         unifiedThemesToUpdate?.themesToSubscribe?.length > 0 ||
         unifiedThemesToUpdate?.themesToBlock?.length > 0 ||
         unifiedThemesToUpdate?.themesToUnsubscribe?.length > 0 ||
         unifiedThemesToUpdate?.themesToUnblock?.length > 0 ||
         Object.keys(propsToSend).length > 0
      );
   };

   const getCurrentFormError = useCallback(
      (): string => errorOnForms.current[formsRequired[currentStep]],
      [formsRequired, currentStep]
   );

   const isLoading: boolean =
      !profileStatus || formsRequired?.length === 0 || requiredFormListLoading || sendingToServer;

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
