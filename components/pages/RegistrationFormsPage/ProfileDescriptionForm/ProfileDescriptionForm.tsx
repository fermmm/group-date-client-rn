import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, TextInput } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";

export interface DescriptionFormProps extends Themed { }
export interface DescriptionFormState { 
   text: string;
}

class ProfileDescriptionForm extends Component<DescriptionFormProps, DescriptionFormState> {
   static defaultProps: Partial<DescriptionFormProps> = {};
   state: DescriptionFormState = {
      text: ""
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <View style={styles.mainContainer}>
            <TitleText>
               Texto libre (opcional)
            </TitleText>
            <TitleMediumText>
               Se va a ver abajo de tu foto, lo podes dejar en blanco.
            </TitleMediumText>
            <TextInput
               autoFocus={true}
               mode="outlined"
               multiline={true}
               value={this.state.text}
               onChangeText={text => this.setState({ text })}
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