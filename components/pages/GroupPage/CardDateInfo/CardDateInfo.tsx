import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text, Button } from "react-native-paper";
import { ThemeExt, Themed } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import TitleText from "../../../common/TitleText/TitleText";
import { currentTheme } from "../../../../config";

export interface DateInfoProps extends Themed { }
export interface DateInfoState { }

class CardDateInfo extends Component<DateInfoProps, DateInfoState> {
   static defaultProps: Partial<DateInfoProps> = {};

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <SurfaceStyled>
            <TitleText>
               Cita votada:
            </TitleText>
            <View style={styles.row}>
               <Text style={styles.textHighlighted}>Fecha:</Text>
               <Text style={styles.textNormal}>Este Sábado 20 de Sep. a las 21hs asdadasd asdads</Text> 
            </View>
            <View style={styles.row}>
               <Text style={styles.textHighlighted}>Lugar:</Text>
               <Text style={styles.textNormal}>Mate + porro en Parque Centenario</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.textHighlighted}>Dirección:</Text>
               <Text style={styles.textNormal}>Av. Angel Gallardo 400</Text>
            </View>
            <Button
               uppercase={false}
               onPress={() => console.log("Pressed")}
            >
               Modificar voto
            </Button>
         </SurfaceStyled>
      );
   }
}

const styles: Styles = StyleSheet.create({
   textHighlighted: {
      fontFamily: currentTheme.fonts.regular,
      fontSize: 15,
      marginRight: 7,
   },
   textNormal: {
      fontFamily: currentTheme.fonts.light,
      fontSize: 15,
      flex: 1,
      flexWrap: "wrap",
   },
   row: {
      flexDirection: "row",
      marginBottom: 10,
   }
});

export default withTheme(CardDateInfo);