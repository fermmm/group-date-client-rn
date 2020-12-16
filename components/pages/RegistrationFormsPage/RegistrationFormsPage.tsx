import React, { useState, FC } from "react";
import { StyleSheet } from "react-native";
import { ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
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
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { LoadingAnimation } from "../../common/LoadingAnimation/LoadingAnimation";
import {
   USE_AUTOMATIC_TARGET_AGE_AT_REGISTRATION,
   USE_AUTOMATIC_TARGET_DISTANCE_AT_REGISTRATION
} from "../../../config";
import { EditableUserProps } from "../../../api/server/shared-tools/validators/user";
import { useRequiredScreensList } from "./hooks/useRequiredScreensList";

// TODO: Agregar validación usando fastest-validator
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
   const [showIncompleteError, setShowIncompleteError] = useState(false);
   const [profileDescription, setProfileDescription] = useState<string>();
   const [dateIdeaFormData, setDateIdeaFormData] = useState<DateIdeaState>();
   const [pictures, setPictures] = useState<string[]>();
   const [errorsBasicInfo, setErrorsBasicInfo] = useState<string>();
   const [errorsProfilePictures, setErrorsProfilePictures] = useState<string>();
   const [errorsDateIdea, setErrorsDateIdea] = useState<string>();

   const { colors }: ThemeExt = useTheme();
   const { navigate }: StackNavigationProp<Record<string, {}>> = useNavigation();

   /**
    * Get which user prop is incomplete and requires user to provide information
    */
   const { data: profileStatus, isLoading } = useServerProfileStatus();

   /**
    * Get list of registration screens names to show, if the user has completed part of the registration
    * in the past, then some screens are not showed so this list based on the profileStatus.
    */
   const screensToShow = useRequiredScreensList(profileStatus);

   /**
    * Props gathered from the user that will be sent
    */
   const [propsGathered, setPropsGathered] = useState<EditableUserProps>({});

   return (
      <>
         <AppBarHeader />
         {isLoading ? (
            <>
               <BasicScreenContainer />
               <LoadingAnimation visible centered />
            </>
         ) : (
            <ScreensStepper
               currentScreen={currentStep}
               swipeEnabled={false}
               onScreenChange={newStep => setCurrentStep(newStep)}
            >
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onContinuePress={() =>
                     errorsBasicInfo == null ? setCurrentStep(1) : setShowIncompleteError(true)
                  }
                  showContinueButton
               >
                  <BasicInfoForm
                     askTargetAge={!USE_AUTOMATIC_TARGET_AGE_AT_REGISTRATION}
                     askTargetDistance={!USE_AUTOMATIC_TARGET_DISTANCE_AT_REGISTRATION}
                     initialFormData={profileStatus.user}
                     onChange={(formData, error) => {
                        setPropsGathered({ ...propsGathered, ...formData });
                        setErrorsBasicInfo(error);
                     }}
                  />
               </BasicScreenContainer>
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onBackPress={() => setCurrentStep(0)}
                  onContinuePress={() =>
                     errorsProfilePictures == null
                        ? setCurrentStep(2)
                        : setShowIncompleteError(true)
                  }
                  showBackButton
                  showContinueButton
               >
                  <ProfilePicturesForm
                     onChange={(pictures, error) => {
                        setPictures(pictures);
                        setErrorsProfilePictures(error);
                     }}
                  />
               </BasicScreenContainer>
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onBackPress={() => setCurrentStep(1)}
                  onContinuePress={() =>
                     errorsDateIdea == null ? setCurrentStep(3) : setShowIncompleteError(true)
                  }
                  showBackButton
                  showContinueButton
               >
                  <DateIdeaForm
                     onChange={(data, error) => {
                        setDateIdeaFormData(data);
                        setErrorsDateIdea(error);
                     }}
                  />
               </BasicScreenContainer>
               <BasicScreenContainer
                  showBottomGradient={true}
                  bottomGradientColor={colors.background}
                  onBackPress={() => setCurrentStep(2)}
                  onContinuePress={() => navigate("Questions")}
                  showBackButton
                  showContinueButton
               >
                  <ProfileDescriptionForm
                     text={profileDescription}
                     onChange={t => setProfileDescription(t)}
                  />
               </BasicScreenContainer>
            </ScreensStepper>
         )}
         <DialogError visible={showIncompleteError} onDismiss={() => setShowIncompleteError(false)}>
            {errorsBasicInfo || errorsProfilePictures || errorsDateIdea}
         </DialogError>
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default RegistrationFormsPage;
