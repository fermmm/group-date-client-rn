import React, { useState, FC } from "react";
import { StyleSheet } from "react-native";
import { ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import ProfileTextForm from "./ProfileTextForm/ProfileTextForm";
import { ScreensStepper } from "../../common/ScreensStepper/ScreensStepper";
import DialogError from "../../common/DialogError/DialogError";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import BasicInfoForm, { BasicInfoState } from "./BasicInfoForm/BasicInfoForm";
import ProfilePicturesForm from "./ProfilePicturesForm/ProfilePicturesForm";
import DateIdeaForm, { DateIdeaState } from "./DateIdeaForm/DateIdeaForm";
import { StackNavigationProp } from "@react-navigation/stack";
import { useServerProfileStatus } from "../../../api/server/user";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

const RegistrationFormsPage: FC = () => {
   const [currentStep, setCurrentStep] = useState(0);
   const [showIncompleteError, setShowIncompleteError] = useState(false);
   const [profileDescription, setProfileDescription] = useState<string>();
   const [basicInfoFormData, setBasicInfoFormData] = useState<BasicInfoState>();
   const [dateIdeaFormData, setDateIdeaFormData] = useState<DateIdeaState>();
   const [pictures, setPictures] = useState<string[]>();
   const [errorsBasicInfo, setErrorsBasicInfo] = useState<string>();
   const [errorsProfilePictures, setErrorsProfilePictures] = useState<string>();
   const [errorsDateIdea, setErrorsDateIdea] = useState<string>();

   const { colors }: ThemeExt = useTheme();
   const { navigate }: StackNavigationProp<Record<string, {}>> = useNavigation();

   const { data, isLoading } = useServerProfileStatus();

   // const userPropToScreenMap: Record<string, EditableUserPropKey[]> = {
   //    name: [""]
   // };

   return (
      <>
         <AppBarHeader title={"Nueva cuenta"} />
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
                  onChange={(formData, error) => {
                     setBasicInfoFormData(formData);
                     setErrorsBasicInfo(error);
                  }}
               />
            </BasicScreenContainer>
            <BasicScreenContainer
               showBottomGradient={true}
               bottomGradientColor={colors.background}
               onBackPress={() => setCurrentStep(0)}
               onContinuePress={() =>
                  errorsProfilePictures == null ? setCurrentStep(2) : setShowIncompleteError(true)
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
               <ProfileTextForm
                  text={profileDescription}
                  onChange={t => setProfileDescription(t)}
               />
            </BasicScreenContainer>
         </ScreensStepper>
         <DialogError visible={showIncompleteError} onDismiss={() => setShowIncompleteError(false)}>
            {errorsBasicInfo || errorsProfilePictures || errorsDateIdea}
         </DialogError>
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default RegistrationFormsPage;
