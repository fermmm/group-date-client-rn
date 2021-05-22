import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import { RegistrationFormName } from "../tools/useRequiredFormList";
import { currentTheme } from "../../../../config";

export interface DescriptionFormProps {
   formName: RegistrationFormName;
   initialData?: { profileDescription?: string };
   onChange(
      formName: RegistrationFormName,
      formData: { profileDescription: string },
      error: string | null
   ): void;
}

const ProfileDescriptionForm: FC<DescriptionFormProps> = ({ initialData, onChange, formName }) => {
   const maxCharactersAllowed: number = 4000;
   const [profileDescription, setProfileDescription] = useState(
      initialData?.profileDescription ?? ""
   );

   useEffect(
      () => onChange(formName, { profileDescription }, getError()),
      [profileDescription, formName]
   );

   const getError = (): string => {
      if (profileDescription?.length > maxCharactersAllowed) {
         return (
            "Te has pasado del máximo de caracteres permitidos por " +
            (profileDescription.length - maxCharactersAllowed) +
            " caracteres"
         );
      }
   };

   return (
      <View style={styles.mainContainer}>
         <TitleText>Texto libre (opcional)</TitleText>
         <TitleMediumText style={styles.subtitle}>
            <TitleMediumText style={styles.subtitleBold}>
               Evita incluir tu contacto de Instagram
            </TitleMediumText>{" "}
            para que no te confundamos con una cuenta spam que solo busca seguidores, es un problema
            muy común.
         </TitleMediumText>
         <TextInputExtended
            errorText={getError()}
            mode="outlined"
            multiline={true}
            value={profileDescription}
            onChangeText={setProfileDescription}
            style={[styles.input]}
         />
      </View>
   );
};
const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20
   },
   subtitle: {},
   subtitleBold: {
      fontFamily: currentTheme.font.medium
   },
   input: {
      flex: 0,
      height: 280
   }
});

export default React.memo(ProfileDescriptionForm);
