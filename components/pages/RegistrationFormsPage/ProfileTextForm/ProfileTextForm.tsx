import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import TextInputExtended from "../../../common/TextInputExtended/TextInputExtended";

export interface DescriptionFormProps extends Themed {
   text: string;
   onChange(newText: string): void;
}

class ProfileTextForm extends Component<DescriptionFormProps> {
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
            <TextInputExtended
               mode="outlined"
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
      padding: 20,
   },
   input: {
      flex: 0,
      height: 200
   },
});

export default withTheme(ProfileTextForm);