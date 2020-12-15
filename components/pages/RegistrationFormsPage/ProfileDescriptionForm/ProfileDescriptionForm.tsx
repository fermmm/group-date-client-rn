import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";

export interface DescriptionFormProps {
   text?: string;
   onChange(newText: string): void;
}

const ProfileDescriptionForm: FC<DescriptionFormProps> = props => {
   const { text, onChange }: DescriptionFormProps = props;

   return (
      <View style={styles.mainContainer}>
         <TitleText>Texto libre (opcional)</TitleText>
         <TitleMediumText>Se verá abajo de tus fotos</TitleMediumText>
         <TextInputExtended
            mode="outlined"
            multiline={true}
            value={text}
            onChangeText={t => onChange(t)}
            style={[
               styles.input,
               {
                  height: text?.length > 0 ? null : 280
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

export default ProfileDescriptionForm;
