import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, TextInput } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";

export interface DescriptionFormProps extends Themed {
   text: string;
   onChange(newText: string): void;
}

class ProfileDescriptionForm extends Component<DescriptionFormProps> {
   static defaultProps: Partial<DescriptionFormProps> = {};

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const {text, onChange}: DescriptionFormProps = this.props;

      return (
         <View style={styles.mainContainer}>
            <TitleText>
               Texto libre (opcional)
            </TitleText>
            <TitleMediumText>
               Es recomendable escribir algo que ayude a conocerte
            </TitleMediumText>
            <TextInput
               mode="outlined"
               label="Texto libre"
               multiline={true}
               value={text}
               onChangeText={t => onChange(t)}
               style={styles.input}
            />
         </View>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20
   },
   input: {
      minHeight: 200
   },
});

export default withTheme(ProfileDescriptionForm);