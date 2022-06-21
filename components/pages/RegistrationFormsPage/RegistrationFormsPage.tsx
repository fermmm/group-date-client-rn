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
import { sendUserProps, useUserProfileStatus } from "../../../api/server/user";
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

export interface ParamsRegistrationFormsPage {
   formsToShow?: RegistrationFormName[];
   questionToShow?: string[];
}

/**
 * This component shows one or more registration forms, is used by both the registration process and also when
 * changing the profile. It can receive a list of required forms to show in the params. Currently when modifying
 * profile only one form is showed because of how the UI flow is designed.
 */
const RegistrationFormsPage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsRegistrationFormsPage>>();
   const { navigateWithoutHistory, goBack, canGoBack, isFocused } = useNavigation();
   const [currentStep, setCurrentStep] = useState(0);
   const [errorDialogVisible, setErrorDialogVisible] = useState(false);
   const [exitDialogVisible, setExitDialogVisible] = useState(false);
   const [sendingToServer, setSendingToServer] = useState(null);
   const [shouldExit, setShouldExit] = useState(false);
   const errorOnForms = useRef<Partial<Record<RegistrationFormName, string>>>({});
   const propsGathered = useRef<EditableUserProps>({});
   const goToNextStepIsPossible = useRef<() => Promise<boolean>>();
   const tagsToUpdate = useRef<Record<string, TagsToUpdate>>({});
   const questionsShowed = useRef<AnswerIds[]>(null);
   // With this we get the info required to know where to redirect on finish
   const { shouldRedirectToRequiredPage, redirectToRequiredPage, shouldRedirectIsLoading } =
      useShouldRedirectToRequiredPage();
   const { data: profileStatus } = useUserProfileStatus();
   const {
      isLoading: requiredFormListLoading,
      formsRequired,
      questionsToShow
   } = useRequiredFormList(
      params != null ? { fromParams: params } : { fromProfileStatus: profileStatus }
   );
   const { token } = useAuthentication(profileStatus?.user?.token);
   useAnalyticsForRegistration(profileStatus?.user, formsRequired, currentStep);
   const { logout } = useLogout();
   const { showIntroMessage } = useIntroMessage();

   const handleOnChangeForm = useCallback(
      (params: OnChangeFormParams) => {
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
      },
      [questionsToShow]
   );

   const updateQuestionsResponded = (questionId: string, answerId: string) => {
      // Remove the question (if present) that we are going to add in the next line
      questionsShowed.current = questionsShowed.current?.filter(q => q.questionId !== questionId);
      // Add the question
      questionsShowed.current = [...(questionsShowed.current ?? []), { questionId, answerId }];
   };

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
   const handleGoBack = useCustomBackButtonAction(() => {
      if (canGoBack() && userChangedSomething() && isFocused()) {
         showExitDialog();
      } else {
         if (canGoBack()) {
            goBack();
         } else {
            logout();
         }
      }

      return true;
   }, []);

   const handleContinueButtonClick = useCallback(async () => {
      if (goToNextStepIsPossible.current != null && !(await goToNextStepIsPossible.current())) {
         return;
      }

      if (getCurrentFormError()) {
         showErrorDialog();
         return;
      }

      if (currentStep < formsRequired.length - 1) {
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
      questionsShowed.current
   ]);

   // Effect in charge of exiting and determining where to exit
   useEffect(() => {
      if (!shouldExit) {
         return;
      }

      if (userChangedSomething()) {
         if (params != null) {
            goBack();
         } else {
            if (shouldRedirectToRequiredPage) {
               redirectToRequiredPage();
            } else {
               navigateWithoutHistory("Main");
               showIntroMessage();
            }
         }
      } else {
         if (canGoBack()) {
            goBack();
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
         Object.keys(propsToSend).length > 0 || questionsShowed.current?.length > 0;

      // We send user props last because it contains questionsShowed prop, which means that the tags were sent
      if (thereArePropsToSend) {
         setSendingToServer(true);
         await sendUserProps(
            {
               token,
               props: (propsToSend ?? {}) as User,
               questionAnswers: questionsShowed.current ?? [],
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

   const userChangedSomething = () => {
      return Object.keys(propsGathered.current).length > 0 || questionsShowed.current?.length > 0;
   };

   const getCurrentFormError = useCallback(
      (): string => errorOnForms.current[formsRequired[currentStep]],
      [formsRequired, currentStep]
   );

   const isLoading: boolean = !profileStatus || requiredFormListLoading || sendingToServer;

   return (
      <>
         <AppBarHeader onBackPress={handleGoBack} showBackButton={params != null} />
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
