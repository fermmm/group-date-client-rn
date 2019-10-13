import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, TextInput } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import TitleText from "../../../common/TitleText/TitleText";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";
// @ts-ignore
import MultiSlider from "@ptomasroos/react-native-multi-slider";

export interface BasicInfoProps extends Themed { }
export interface BasicInfoState {
   nameText: string;
   ageText: string;
   bodyHeight: string;
}

class BasicInfoForm extends Component<BasicInfoProps, BasicInfoState> {
   static defaultProps: Partial<BasicInfoProps> = {};
   state: BasicInfoState = {
      nameText: "",
      ageText: "",
      bodyHeight: "",
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { nameText, ageText, bodyHeight }: Partial<BasicInfoState> = this.state;

      return (
         <View style={styles.mainContainer}>
            <TitleText>
               Datos básicos
            </TitleText>
            <TextInput
               label="Tu nombre o apodo"
               mode="outlined"
               value={this.state.nameText}
               onChangeText={text => this.setState({ nameText: text })}
            />
            <TextInput
               label="Edad"
               mode="outlined"
               keyboardType="number-pad"
               value={this.state.ageText}
               onChangeText={text => this.setState({ ageText: text })}
            />
            <TitleMediumText style={styles.label}>
               Tu altura en centímetros (es opcional) ej: 160
               Este dato para algunes es muy importante y a otres no les importa para nada
            </TitleMediumText>
            <TextInput
               label="Altura (opcional)"
               mode="outlined"
               keyboardType="number-pad"
               value={this.state.bodyHeight}
               onChangeText={text => this.setState({ bodyHeight: text })}
            />
            <TitleMediumText style={styles.label}>
               Rango de edades visible
            </TitleMediumText>
            <MultiSlider
               min={0}
               max={10}
               values={[0, 5]}
               onValuesChange={(v: number[]) => console.log(v)}
               touchDimensions={{
                  height: 100,
                  width: 100,
               }}
            // onValuesChangeStart={this.disableScroll}
            // onValuesChangeFinish={this.enableScroll}
            />
         </View>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      padding: 20
   },
   label: {
      marginTop: 30,
      marginBottom: 0
   },
   labelLine2: {
      marginBottom: 0
   }
});

export default withTheme(BasicInfoForm);