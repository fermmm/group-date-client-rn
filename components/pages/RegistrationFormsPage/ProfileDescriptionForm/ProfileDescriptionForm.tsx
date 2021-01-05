import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";
import { RegistrationFormName } from "../hooks/useRequiredFormList";

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
   const [profileDescription, setProfileDescription] = useState(initialData?.profileDescription);

   useEffect(() => onChange(formName, { profileDescription }, getError()), [
      profileDescription,
      formName
   ]);

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
         <TitleMediumText>Se verá abajo de tus fotos</TitleMediumText>
         <TextInputExtended
            errorText={getError()}
            mode="outlined"
            multiline={true}
            value={profileDescription}
            onChangeText={setProfileDescription}
            style={[
               styles.input,
               {
                  height: profileDescription?.length > 0 ? null : 280
               }
            ]}
         />
      </View>
   );
};
const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20
   },
   input: {
      flex: 0
   }
});

export default React.memo(ProfileDescriptionForm);
