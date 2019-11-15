import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, TextInput } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import AgeSelector from "../../../common/AgeSelector/AgeSelector";
import { formValidators } from "../../../../common-tools/formValidators/formValidators";
import { currentTheme } from "../../../../config";

export interface BasicInfoProps extends Themed {
   onChange(formData: BasicInfoState, error: string | null): void;
}
export interface BasicInfoState {
   nameText: string;
   age: number;
   bodyHeight: number;
   targetAgeMin: number;
   targetAgeMax: number;
   targetAgeModified: boolean;
}

class BasicInfoForm extends Component<BasicInfoProps, BasicInfoState> {
   static defaultProps: Partial<BasicInfoProps> = {};
   defaultAgeDifference: number = 9;
   state: BasicInfoState = {
      nameText: "",
      age: null,
      bodyHeight: null,
      targetAgeMin: 18,
      targetAgeMax: 28,
      targetAgeModified: false,
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { nameText, age, bodyHeight, targetAgeModified, targetAgeMin, targetAgeMax }: Partial<BasicInfoState> = this.state;

      return (
         <View style={styles.mainContainer}>
            <TitleText>
               Datos básicos
            </TitleText>
            <TextInput
               label="Tu nombre o apodo"
               mode="outlined"
               value={nameText}
               onChangeText={t => this.setState({ nameText: formValidators.name(t).result.text }, () => this.sendChanges())}
            />
            <TextInput
               label="Edad"
               mode="outlined"
               keyboardType="number-pad"
               value={age ? age.toString() : ""}
               onChangeText={t => this.setState({ age: Number(formValidators.age(t).result.text) }, () => this.sendChanges())}
            />
            <TitleMediumText style={styles.label}>
               Tu altura en centímetros (opcional) ej: 160
            </TitleMediumText>
            <TitleMediumText style={styles.labelLine2}>
               Este dato para algunes es muy importante y a otres no les importa
            </TitleMediumText>
            <TextInput
               label="Tu altura (opcional)"
               mode="outlined"
               keyboardType="number-pad"
               value={bodyHeight ? bodyHeight.toString() : ""}
               onChangeText={t => this.setState({ bodyHeight: Number(formValidators.bodyHeight(t).result.text) || 0 }, () => this.sendChanges())}
            />
            <TitleMediumText style={styles.label}>
               ¿Qué edades te interesan más?
            </TitleMediumText>
            <TitleMediumText style={styles.labelLine2}>
               Esta funcionalidad no actúa de forma totalmente estricta
            </TitleMediumText>
               <AgeSelector
                  min={targetAgeModified ? targetAgeMin : age - this.defaultAgeDifference}
                  max={targetAgeModified ? targetAgeMax : age + this.defaultAgeDifference}
                  style={styles.ageSelector}
                  onChange={({ min, max }) =>
                     this.setState({
                        targetAgeMin: min,
                        targetAgeMax: max,
                        targetAgeModified: true
                     }, () => this.sendChanges())
                  }
               />
         </View>
      );
   }

   sendChanges(): void {
      const { nameText, age }: Partial<BasicInfoState> = this.state;
      const error: string = this.getError();

      this.props.onChange(this.state, error);
   }

   getError(): string {
      const { nameText, age }: Partial<BasicInfoState> = this.state;

      if (nameText.length === 0) {
         return "Tenes que escribir un nombre o apodo";
      }

      if (nameText.length < 2) {
         return "El nombre o apodo es demasiado corto";
      }

      if (age == null) {
         return "El campo de edad esta vacío";
      }

      if (age < 12) {
         return "Edad demasiado baja";
      }

      return null;
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20,
   },
   label: {
      marginTop: 30,
      marginBottom: 0
   },
   labelLine2: {
      marginBottom: 0,
      fontFamily: currentTheme.fonts.extraLight
   },
   ageSelector: {
      marginLeft: 5
   }
});

export default withTheme(BasicInfoForm);