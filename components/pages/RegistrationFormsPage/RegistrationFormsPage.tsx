import React, { useState, FC, useRef, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import Dialog from "../../common/Dialog/Dialog";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import DateIdeaForm from "./DateIdeaForm/DateIdeaForm";
import { sendUserProps, useQuestions, useUserProfileStatus } from "../../../api/server/user";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import {
   EditableUserPropKey,
   EditableUserProps
} from "../../../api/server/shared-tools/validators/user";
import { RegistrationFormName, useRequiredFormList } from "./tools/useRequiredFormList";
import ProfileImagesForm from "./ProfileImagesForm/ProfileImagesForm";
import { AnswerIds, User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import FiltersForm from "./FiltersForm/FiltersForm";
import QuestionForm from "./TagsAsQuestionForm/TagsAsQuestionForm";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useAuthentication, useLogout } from "../../../api/authentication/useAuthentication";
import { revalidate } from "../../../api/tools/useCache/useCache";
import { filterNotReallyChangedProps } from "./tools/filterNotReallyChangedProps";
import { useCustomBackButtonAction } from "../../../common-tools/device-native-api/hardware-buttons/useCustomBackButtonAction";
import GenderForm from "./GenderForm/GenderForm";
import { useAnalyticsForRegistration } from "../../../common-tools/analytics/registrationFormsPage/useAnalyticsForRegistration";
import { analyticsLogEvent } from "../../../common-tools/analytics/tools/analyticsLog";
import TitleMediumText from "../../common/TitleMediumText/TitleMediumText";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { useShouldRedirectToRequiredPage } from "../../../common-tools/navigation/useShouldRedirectToRequiredPage";
import { useIntroMessage } from "../../../common-tools/messages/showBetaVersionMessage";
import { removeQuestionsRespondedByOtherQuestions } from "./tools/questions-tools";

export interface ParamsRegistrationFormsPage {
   formsToShow?: RegistrationFormName[];
   questionToShow?: string[];
}

/**
 * This page shows one or more registration forms, is used by both the registration process and also when
 * changing the profile. It can receive a list of required forms to show in the navigation params and of not present
 * it will check in the server for missing registration steps. When editing the profile you should call this page
 * showing only one form because it's the best for the user experience.
 */
const RegistrationFormsPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsRegistrationFormsPage>>();
   const registrationMode = params == null;
   const { navigateWithoutHistory, goBack, canGoBack, isFocused } = useNavigation();
   const [currentStep, setCurrentStep] = useState(0);
   const [errorDialogVisible, setErrorDialogVisible] = useState(false);
   const [exitDialogVisible, setExitDialogVisible] = useState(false);
   const [confirmLogoutDialogVisible, setConfirmLogoutDialogVisible] = useState(false);
   const [sendingToServer, setSendingToServer] = useState(null);
   const [shouldExit, setShouldExit] = useState(false);
   const errorOnForms = useRef<Partial<Record<RegistrationFormName, string>>>({});
   const propsGathered = useRef<EditableUserProps>({});
   const goToNextStepIsPossible = useRef<() => Promise<boolean>>();
   const tagsToUpdate = useRef<Record<string, TagsToUpdate>>({});
   const questionsResponded = useRef<AnswerIds[]>(null);
   const { data: allQuestions, isLoading: loadingAllQuestions } = useQuestions();
   // With this we get the info required to know where to redirect on finish
   const { shouldRedirectToRequiredPage, redirectToRequiredPage, shouldRedirectIsLoading } =
      useShouldRedirectToRequiredPage();
   const { data: profileStatus } = useUserProfileStatus();
   const {
      formsRequired,
      questionsToShow,
      update: updateRequiredForms
   } = useRequiredFormList(
      registrationMode ? { fromProfileStatus: profileStatus } : { fromParams: params },
      allQuestions
   );

   const { token } = useAuthentication(profileStatus?.user?.token);
   useAnalyticsForRegistration(profileStatus?.user, formsRequired, currentStep);
   const { logout } = useLogout();
   const { showIntroMessage } = useIntroMessage();

   const handleOnChangeForm = useCallback((params: OnChangeFormParams) => {
      goToNextStepIsPossible.current = params.goToNextStepIsPossible;
      if (params.answerId) {
         updateQuestionsResponded(params.formName, params.answerId);
      }

      propsGathered.current = {
         ...propsGathered.current,
         ...(params.newProps ?? {})
      };

      propsGathered.current = filterNotReallyChangedProps(
         propsGathered.current,
         profileStatus?.user
      );

      errorOnForms.current[params.formName] = params.error;

      if (params.tagsToUpdate != null) {
         tagsToUpdate.current[params.formName] = params.tagsToUpdate;
      }
   }, []);

   const updateQuestionsResponded = (questionId: string, answerId: string) => {
      // Remove the question (if present) that we are going to add in the next line
      questionsResponded.current = questionsResponded.current?.filter(
         q => q.questionId !== questionId
      );

      // Add the question
      questionsResponded.current = [
         ...(questionsResponded.current ?? []),
         { questionId, answerId }
      ];

      // Clean the list because it may contain answers that are already answer by previous questions, this happens if the user answers and then goes back and change the answer
      questionsResponded.current = removeQuestionsRespondedByOtherQuestions(
         questionsResponded.current,
         allQuestions
      );
   };

   const showErrorDialog = useCallback(() => setErrorDialogVisible(true), []);
   const hideErrorDialog = useCallback(() => setErrorDialogVisible(false), []);
   const showExitDialog = useCallback(() => setExitDialogVisible(true), []);
   const hideExitDialog = useCallback(() => setExitDialogVisible(false), []);
   const showConfirmLogoutDialog = useCallback(() => setConfirmLogoutDialogVisible(true), []);
   const hideConfirmLogoutDialog = useCallback(() => setConfirmLogoutDialogVisible(false), []);

   const userChangedSomething = useCallback(() => {
      return (
         Object.keys(propsGathered.current).length > 0 || questionsResponded.current?.length > 0
      );
   }, []);

   /**
    * Called when touching the back button rendered on the bottom of the screen, this button is not present on the first step or when there is only 1 step
    */
   const handleBackStepPress = useCallback(() => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   }, [currentStep]);

   /**
    * This triggers when the current step is not the first one and the user presses the android device back button/gesture or when horizontal scroll swiping is
    * enabled and the user swipes (Swiping not enabled right now, it's problematic to enable it).
    */
   const handleScreenChange = useCallback((newScreen: number) => {
      setCurrentStep(newScreen);
   }, []);

   /**
    * This triggers when the current step is the first one and the user presses the android
    * device back button/gesture or the back button located at the header of the screen.
    * The button at the header of the screen only is visible on the first step.
    */
   const handleFirstStepBack = useCustomBackButtonAction(() => {
      if (!isFocused()) {
         return false;
      }

      if (registrationMode) {
         showConfirmLogoutDialog();
      } else {
         if (userChangedSomething()) {
            showExitDialog();
         } else {
            goBack();
         }
      }

      return true;
   }, [registrationMode, userChangedSomething]);

   /**
    * his triggers when the continue button at the bottom of the screen is pressed or when the save
    * button is pressed in the "Do you want to save?" dialog on exit
    */
   const handleContinueButtonClick = useCallback(async () => {
      if (goToNextStepIsPossible.current != null && !(await goToNextStepIsPossible.current())) {
         return;
      }

      if (getCurrentFormError()) {
         showErrorDialog();
         return;
      }

      if (currentStep < formsRequired.length - 1) {
         // Before moving to the next step we refresh the required forms because responding some questions may remove other questions
         updateRequiredForms({ questionsResponded: questionsResponded.current });
         setCurrentStep(currentStep + 1);
      } else {
         await sendDataToServer();
         setShouldExit(true);
      }
   }, [
      currentStep,
      formsRequired,
      propsGathered.current,
      tagsToUpdate.current,
      questionsResponded.current
   ]);

   /**
    * When data is sent to server we exit, this effect is in charge of determining where to exit (only when data was saved and not when cancelling)
    * */
   useEffect(() => {
      if (!shouldExit) {
         return;
      }

      if (shouldRedirectToRequiredPage) {
         redirectToRequiredPage();
      } else {
         if (!registrationMode) {
            goBack();
         } else {
            navigateWithoutHistory("Main");
            showIntroMessage();
         }
      }
   }, [shouldExit, shouldRedirectToRequiredPage]);

   const sendDataToServer = async () => {
      let propsToSend: EditableUserProps = propsGathered.current ?? {};

      if ((propsToSend?.name as string)?.endsWith(" ")) {
         propsToSend.name = (propsToSend.name as string).slice(0, -1);
      }

      /**
       * Check if the user changed a prop that affects cards recommendation, in that case invalidate the query
       */
      const recommendationsRelatedKeys: EditableUserPropKey[] = [
         "targetDistance",
         "targetAgeMin",
         "targetAgeMax",
         "birthDate"
      ];
      const keysMutated = Object.keys(propsToSend) as EditableUserPropKey[];
      const recommendationsRelatedProps = keysMutated.filter(key =>
         recommendationsRelatedKeys.includes(key)
      );
      const thereAreRecommendationsRelatedChanges = recommendationsRelatedProps.length > 0;
      const thereArePropsToSend =
         Object.keys(propsToSend).length > 0 || questionsResponded.current?.length > 0;

      // We send user props last because it contains questionsShowed prop, which means that the tags were sent
      if (thereArePropsToSend) {
         setSendingToServer(true);
         await sendUserProps(
            {
               token,
               props: (propsToSend ?? {}) as User,
               questionAnswers: questionsResponded.current ?? [],
               updateProfileCompletedProp: true
            },
            true
         );
      }

      if (thereAreRecommendationsRelatedChanges) {
         await revalidate("cards-game/recommendations");
      }

      if (thereArePropsToSend) {
         // This component uses profileStatus.user to update the components status so this is required to have the updated data next time this component mounts
         await revalidate("user/profile-status");
      }

      if (profileStatus?.user != null && !profileStatus?.user?.profileCompleted) {
         analyticsLogEvent(`registration_completed`);
      }
   };

   const getCurrentFormError = useCallback(
      (): string => errorOnForms.current[formsRequired[currentStep]],
      [formsRequired, currentStep]
   );

   const isLoading: boolean =
      !profileStatus || sendingToServer || loadingAllQuestions || shouldRedirectIsLoading;

   return (
      <>
         <AppBarHeader onBackPress={handleFirstStepBack} showBackButton={currentStep === 0} />
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
                     onBackPress={handleBackStepPress}
                     showBackButton={i > 0}
                     continueButtonTextFinishMode={i === formsRequired.length - 1}
                     showContinueButton
                     key={i}
                  >
                     {formsRequired.length > 1 && (
                        <TitleMediumText style={styles.remainingStepsText}>
                           Paso {i + 1} de {formsRequired.length}
                        </TitleMediumText>
                     )}
                     {formName === "BasicInfoForm" && (
                        <BasicInfoForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {formName === "FiltersForm" && (
                        <FiltersForm
                           formName={formName}
                           initialData={profileStatus.user}
                           birthDateSelected={propsGathered?.current?.birthDate as number}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {formName === "ProfileImagesForm" && (
                        <ProfileImagesForm
                           formName={formName}
                           initialData={profileStatus.user as User}
                           isCoupleProfile={false} // This used to contain the real value but now it's part of a question so we don't ave it
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {formName === "DateIdeaForm" && (
                        <DateIdeaForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {formName === "ProfileDescriptionForm" && (
                        <ProfileDescriptionForm
                           formName={formName}
                           initialData={profileStatus.user}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {formName === "GenderForm" && (
                        <GenderForm
                           formName={formName}
                           initialData={profileStatus.user}
                           isOnFocus={currentStep === i}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {formName === "TargetGenderForm" && (
                        <GenderForm
                           genderTargetMode
                           formName={formName}
                           initialData={profileStatus.user}
                           isOnFocus={currentStep === i}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {questionsToShow.includes(formName) && (
                        <QuestionForm
                           formName={formName}
                           questionId={formName}
                           initialData={
                              profileStatus?.user?.questionsResponded?.find(
                                 q => q.questionId === formName
                              )?.answerId ?? null
                           }
                           onChange={handleOnChangeForm}
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
         <Dialog
            visible={confirmLogoutDialogVisible}
            onDismiss={hideConfirmLogoutDialog}
            buttons={[{ label: "Cerrar sesión", onTouch: logout }, { label: "Cancelar" }]}
         >
            Debes responder las preguntas para continuar, puedes cerrar la sesión si lo deseas
         </Dialog>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   remainingStepsText: {
      marginBottom: 5,
      paddingLeft: 10,
      opacity: 0.5
   }
});

export interface TagsToUpdate {
   tagsToUnsubscribe?: string[];
   tagsToSubscribe?: string[];
   tagsToBlock?: string[];
   tagsToUnblock?: string[];
}

export interface OnChangeFormParams {
   formName: RegistrationFormName | string;
   newProps?: EditableUserProps;
   error?: string | null;
   tagsToUpdate?: TagsToUpdate;
   answerId?: string;
   goToNextStepIsPossible?: () => Promise<boolean>;
}

export default RegistrationFormsPage;
