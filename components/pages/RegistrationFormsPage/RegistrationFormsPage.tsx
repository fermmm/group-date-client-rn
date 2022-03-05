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
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import PropAsQuestionForm from "./PropAsQuestionForm/PropAsQuestionForm";
import FiltersForm from "./FiltersForm/FiltersForm";
import TagsAsQuestionForm from "./TagsAsQuestionForm/TagsAsQuestionForm";
import { getUnifiedTagsToUpdate } from "./tools/useUnifiedTagsToUpdate";
import { sendTags, TagEditAction, useTagsAsQuestions } from "../../../api/server/tags";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { useAuthentication, useLogout } from "../../../api/authentication/useAuthentication";
import { revalidate } from "../../../api/tools/useCache/useCache";
import { filterNotReallyChangedProps } from "./tools/filterNotReallyChangedProps";
import { useCustomBackButtonAction } from "../../../common-tools/device-native-api/hardware-buttons/useCustomBackButtonAction";
import { showIntroMessage } from "../../../common-tools/messages/showBetaVersionMessage";
import GenderForm from "./GenderForm/GenderForm";
import { IsCoupleQuestion } from "./IsCoupleQuestion/IsCoupleQuestion";
import { useAnalyticsForRegistration } from "../../../common-tools/analytics/registrationFormsPage/useAnalyticsForRegistration";
import { analyticsLogEvent } from "../../../common-tools/analytics/tools/analyticsLog";
import TitleMediumText from "../../common/TitleMediumText/TitleMediumText";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { useShouldRedirectToRequiredPage } from "../../../common-tools/navigation/useShouldRedirectToRequiredPage";

export interface ParamsRegistrationFormsPage {
   formsToShow?: RegistrationFormName[];
   tagsAsQuestionsToShow?: string[];
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
   const questionsShowed = useRef<string[]>(null);
   // With this we get the info required to know where to redirect on finish
   const { shouldRedirectToRequiredPage, redirectToRequiredPage, shouldRedirectIsLoading } =
      useShouldRedirectToRequiredPage();
   const { data: profileStatus } = useUserProfileStatus();
   const { data: tagsAsQuestions } = useTagsAsQuestions();
   const {
      isLoading: requiredFormListLoading,
      formsRequired,
      knownFormsWithPropsTheyChange,
      unknownPropsQuestions,
      tagsAsQuestionsToShow
   } = useRequiredFormList(
      params != null ? { fromParams: params } : { fromProfileStatus: profileStatus }
   );
   const { token } = useAuthentication(profileStatus?.user?.token);
   useAnalyticsForRegistration(profileStatus?.user, formsRequired, currentStep);
   const { logout } = useLogout();

   const handleOnChangeForm = useCallback(
      (params: OnChangeFormParams) => {
         goToNextStepIsPossible.current = params.goToNextStepIsPossible;
         updateQuestionsShowed(params.formName);

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
      [tagsAsQuestionsToShow]
   );

   const updateQuestionsShowed = (formName: string) => {
      if (
         tagsAsQuestionsToShow.includes(formName) &&
         !questionsShowed.current?.includes(formName) &&
         !profileStatus?.user?.questionsShowed?.includes(formName)
      ) {
         questionsShowed.current = [
            ...(questionsShowed.current ?? []),
            ...(profileStatus?.user?.questionsShowed ?? []),
            formName
         ];
      }
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
      let propsToSend: EditableUserProps = propsGathered.current;
      const unifiedTagsToUpdate = getUnifiedTagsToUpdate(tagsToUpdate.current);
      let thereAreTagsChanges: boolean = false;

      if (questionsShowed.current?.length > 0) {
         propsToSend.questionsShowed = questionsShowed.current;
      }
      if ((propsToSend?.name as string)?.endsWith(" ")) {
         propsToSend.name = (propsToSend.name as string).slice(0, -1);
      }

      if (unifiedTagsToUpdate?.tagsToSubscribe?.length > 0) {
         setSendingToServer(true);
         thereAreTagsChanges = true;
         await sendTags({
            action: TagEditAction.Subscribe,
            tagIds: unifiedTagsToUpdate.tagsToSubscribe,
            token
         });
      }
      if (unifiedTagsToUpdate?.tagsToBlock?.length > 0) {
         setSendingToServer(true);
         thereAreTagsChanges = true;
         await sendTags({
            action: TagEditAction.Block,
            tagIds: unifiedTagsToUpdate.tagsToBlock,
            token
         });
      }
      if (unifiedTagsToUpdate?.tagsToUnsubscribe?.length > 0) {
         setSendingToServer(true);
         thereAreTagsChanges = true;
         await sendTags({
            action: TagEditAction.RemoveSubscription,
            tagIds: unifiedTagsToUpdate.tagsToUnsubscribe,
            token
         });
      }

      if (unifiedTagsToUpdate?.tagsToUnblock?.length > 0) {
         setSendingToServer(true);
         thereAreTagsChanges = true;
         await sendTags({
            action: TagEditAction.RemoveBlock,
            tagIds: unifiedTagsToUpdate.tagsToUnblock,
            token
         });
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
      const thereArePropsToSend = Object.keys(propsToSend).length > 0;

      // We send user props last because it contains questionsShowed prop, which means that the tags were sent
      if (thereArePropsToSend) {
         setSendingToServer(true);
         await sendUserProps(
            { token, props: propsToSend as User, updateProfileCompletedProp: true },
            true
         );
      }

      if (thereAreRecommendationsRelatedChanges || thereAreTagsChanges) {
         await revalidate("cards-game/recommendations");
      }

      if (thereArePropsToSend || thereAreTagsChanges) {
         // This component uses profileStatus.user to update the components status so this is required to have the updated data next time this component mounts
         await revalidate("user/profile-status");
      }

      if (profileStatus?.user != null && !profileStatus?.user?.profileCompleted) {
         analyticsLogEvent(`registration_completed`);
      }
   };

   const userChangedSomething = () => {
      const unifiedTagsToUpdate = getUnifiedTagsToUpdate(tagsToUpdate.current);

      return (
         questionsShowed.current?.length > 0 ||
         unifiedTagsToUpdate?.tagsToSubscribe?.length > 0 ||
         unifiedTagsToUpdate?.tagsToBlock?.length > 0 ||
         unifiedTagsToUpdate?.tagsToUnsubscribe?.length > 0 ||
         unifiedTagsToUpdate?.tagsToUnblock?.length > 0 ||
         Object.keys(propsGathered.current).length > 0
      );
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
                           isCoupleProfile={
                              (propsGathered.current?.isCoupleProfile as boolean) ??
                              profileStatus.user?.isCoupleProfile
                           }
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
                     {formName === "CoupleProfileForm" && (
                        <IsCoupleQuestion
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           isOnFocus={currentStep === i}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {unknownPropsQuestions.includes(formName) && (
                        <PropAsQuestionForm
                           formName={formName}
                           propNamesToChange={knownFormsWithPropsTheyChange[formName]}
                           initialData={profileStatus.user}
                           onChange={handleOnChangeForm}
                        />
                     )}
                     {tagsAsQuestionsToShow.includes(formName) && (
                        <TagsAsQuestionForm
                           formName={formName}
                           questionId={formName}
                           initialData={profileStatus.user}
                           mandatoryQuestion={true}
                           tagsAsQuestions={tagsAsQuestions}
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
   goToNextStepIsPossible?: () => Promise<boolean>;
}

export default RegistrationFormsPage;
