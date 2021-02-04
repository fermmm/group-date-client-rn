import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Themed } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import TitleText from "../../../common/TitleText/TitleText";
import { currentTheme } from "../../../../config";

export interface DateInfoProps {
   onModifyVotePress(): void;
}
export interface DateInfoState {}

const CardDateInfo: FC<DateInfoProps> = props => {
   return (
      <SurfaceStyled>
         <TitleText>Cita votada:</TitleText>
         <View style={styles.row}>
            <Text style={styles.textHighlighted}>Fecha:</Text>
            <Text style={styles.textNormal}>Este Sábado 20 de Sep. a las 21hs</Text>
         </View>
         <View style={styles.row}>
            <Text style={styles.textHighlighted}>Lugar:</Text>
            <Text style={styles.textNormal}>Mate + porro en Parque Centenario</Text>
         </View>
         <Button uppercase={false} onPress={() => props.onModifyVotePress()}>
            Modificar voto
         </Button>
      </SurfaceStyled>
   );
};

const styles: Styles = StyleSheet.create({
   textHighlighted: {
      fontFamily: currentTheme.font.regular,
      fontSize: 15,
      marginRight: 7
   },
   textNormal: {
      fontFamily: currentTheme.font.light,
      fontSize: 15,
      flex: 1,
      flexWrap: "wrap"
   },
   row: {
      flexDirection: "row",
      marginBottom: 10
   }
});

export default CardDateInfo;
