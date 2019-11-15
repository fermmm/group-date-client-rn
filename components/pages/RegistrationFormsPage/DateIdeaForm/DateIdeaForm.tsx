import React, { Component } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { withTheme, TextInput } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
import { currentTheme } from "../../../../config";
import TitleSmallText from "../../../common/TitleSmallText/TitleSmallText";

export interface DateIdeaProps extends Themed {
   onChange(formData: DateIdeaState, error: string | null): void;
}
export interface DateIdeaState {
   placeName: string;
   address: string;
}

class DateIdeaForm extends Component<DateIdeaProps, DateIdeaState> {
   state: DateIdeaState = {
      placeName: "",
      address: "",
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { placeName, address }: Partial<DateIdeaState> = this.state;

      return (
         <View style={styles.mainContainer}>
            <TitleText>
               ¿Dónde harías una cita grupal?
            </TitleText>
            <TitleSmallText>
               Para que funcione la aplicación es muy importante que completes esta información de forma válida, más adelante vas a ver por qué.
               Todos conocemos algún lugar tranquilo para conocernos sin molestias.
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleSmallText>
               Test
            </TitleSmallText>
            <TitleMediumText style={styles.label}>
               Nombre del lugar
            </TitleMediumText>
            <TitleMediumText style={styles.labelLine2}>
               Podes incluir algún otro dato. Ejemplo: "Hagamos una cena en el parque del lago"
            </TitleMediumText>
            <TextInput
               // label="Nombre y descrpción"
               mode="outlined"
               value={placeName}
               onChangeText={t => this.setState({ placeName: t }, () => this.sendChanges())}
            />
            <TitleMediumText style={styles.label}>
               Dirección completa (con detalle suficiente)
            </TitleMediumText>
            <TextInput
               // label="Dirección"
               mode="outlined"
               value={address}
               onChangeText={t => this.setState({ address: t }, () => this.sendChanges())}
            />
            <View style={{ flex: 1 }} />
         </View>
      );
   }

   sendChanges(): void {
      this.props.onChange({ ...this.state }, this.getError());
   }

   getError(): string {
      const { placeName, address }: Partial<DateIdeaState> = this.state;

      if (placeName.length < 3) {
         return "Tenés que escribir un nombre válido, es importante para que funcione la app";
      }

      if (address.length < 2) {
         return "Tenés que escribir una dirección válida, es importante para que funcione la app";
      }

      return null;
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20,
      justifyContent: "flex-end",
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

export default withTheme(DateIdeaForm);