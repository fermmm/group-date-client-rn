import React, { useState, FC } from "react";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileDescriptionForm from "./ProfileDescriptionForm/ProfileDescriptionForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm from "./BasicInfoForm/BasicInfoForm";
import ProfilePicturesForm from "./ProfilePicturesForm/ProfilePicturesForm";
import DateIdeaForm, { DateIdeaState } from "./DateIdeaForm/DateIdeaForm";
import { StackNavigationProp } from "@react-navigation/stack";
import { useServerProfileStatus } from "../../../api/server/user";
import { useNavigation } from "@react-navigation/native";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import {
   USE_AUTOMATIC_TARGET_AGE_AT_REGISTRATION,
   USE_AUTOMATIC_TARGET_DISTANCE_AT_REGISTRATION
} from "../../../config";
import { EditableUserProps } from "../../../api/server/shared-tools/validators/user";
import { RegistrationFormName, useRequiredScreensList } from "./hooks/useRequiredScreensList";

/*
   [Hecho] name
   [Hecho] age
   [Hecho] height
   [Hecho] targetAgeMin
   [Hecho] targetAgeMax
   [Hecho] targetDistance
   [Hecho] locationLat
   [Hecho] locationLon
   [Hecho] cityName
   [Hecho] country

   images
   dateIdea
   profileDescription
   
   gender
   likesWoman
   likesMan
   likesWomanTrans
   likesManTrans
   likesOtherGenders
   isCoupleProfile

   questionsShowed
*/

const RegistrationFormsPage: FC = () => {
   const [currentStep, setCurrentStep] = useState(0);
   const [showErrorDialog, setShowErrorDialog] = useState(false);
   const [currentErrorOnForms, setCurrentErrorOnForms] = useState<
      Partial<Record<RegistrationFormName, string>>
   >({});

   const [profileDescription, setProfileDescription] = useState<string>();
   const [dateIdeaFormData, setDateIdeaFormData] = useState<DateIdeaState>();
   const [pictures, setPictures] = useState<string[]>();
   const [errorsProfilePictures, setErrorsProfilePictures] = useState<string>();
   const [errorsDateIdea, setErrorsDateIdea] = useState<string>();

   const { navigate }: StackNavigationProp<Record<string, {}>> = useNavigation();

   /**
    * Get which user prop is incomplete and requires user to provide information
    */
   const { data: profileStatus, isLoading } = useServerProfileStatus();

   /**
    * Get list of registration screens names to show, if the user has completed part of the registration
    * in the past, then some screens are not showed so this list based on the profileStatus.
    */
   const formNamesToShow = useRequiredScreensList(profileStatus);

   /**
    * Props gathered from the user that will be sent
    */
   const [propsGathered, setPropsGathered] = useState<EditableUserProps>({});

   const handleFormChange = (
      formName: RegistrationFormName,
      props: EditableUserProps,
      error: string | null
   ) => {
      setPropsGathered({ ...propsGathered, ...props });
      setCurrentErrorOnForms({ ...currentErrorOnForms, [formName]: error });
   };

   const handleContinueButtonClick = (screenName: RegistrationFormName) => {
      if (currentErrorOnForms && currentErrorOnForms[screenName] != null) {
         setShowErrorDialog(true);
         return;
      }

      if (currentStep < formNamesToShow.length - 1) {
         setCurrentStep(currentStep + 1);
      } else {
         // TODO:
         // Enviar los datos
         // Como es el ultimo invalida el cache de profile status
         // Si profile status esta ok vamos a la siguiente pantalla (Configurable via props)
      }
   };

   const handleBackButtonClick = () => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   };

   const getCurrentFormName = (): RegistrationFormName => formNamesToShow[currentStep];
   const getCurrentFormError = (): string => currentErrorOnForms[getCurrentFormName()];

   return (
      <>
         <AppBarHeader />
         {isLoading ? (
            <>
               <BasicScreenContainer />
               <LoadingAnimation visible centered />
            </>
         ) : (
            <ScreensStepper currentScreen={currentStep} swipeEnabled={false}>
               {formNamesToShow.map((screenName, i) => (
                  <BasicScreenContainer
                     showBottomGradient={true}
                     onContinuePress={() => handleContinueButtonClick(screenName)}
                     onBackPress={handleBackButtonClick}
                     showBackButton={i > 0}
                     showContinueButton
                     key={screenName}
                  >
                     {screenName === "BasicInfoForm" && (
                        <BasicInfoForm
                           askTargetAge={!USE_AUTOMATIC_TARGET_AGE_AT_REGISTRATION}
                           askTargetDistance={!USE_AUTOMATIC_TARGET_DISTANCE_AT_REGISTRATION}
                           initialFormData={profileStatus.user}
                           onChange={(newData, error) =>
                              handleFormChange("BasicInfoForm", newData, error)
                           }
                        />
                     )}
                     {screenName === "ProfilePicturesForm" && (
                        <ProfilePicturesForm
                           onChange={(pictures, error) => {
                              setPictures(pictures);
                              setErrorsProfilePictures(error);
                           }}
                        />
                     )}
                     {screenName === "DateIdeaForm" && (
                        <DateIdeaForm
                           onChange={(data, error) => {
                              setDateIdeaFormData(data);
                              setErrorsDateIdea(error);
                           }}
                        />
                     )}
                     {screenName === "ProfileDescriptionForm" && (
                        <ProfileDescriptionForm
                           text={profileDescription}
                           onChange={t => setProfileDescription(t)}
                        />
                     )}
                  </BasicScreenContainer>
               ))}
            </ScreensStepper>
         )}
         <DialogError visible={showErrorDialog} onDismiss={() => setShowErrorDialog(false)}>
            {getCurrentFormError()}
         </DialogError>
      </>
   );
};

export default RegistrationFormsPage;
