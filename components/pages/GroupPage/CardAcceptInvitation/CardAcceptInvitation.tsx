import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import TitleMediumText from "../../../common/TitleMediumText/TitleMediumText";

export interface AcceptInvitationProps extends Themed {
   matchAmmount: number;
   onAcceptPress(): void;
}

class CardAcceptInvitation extends Component<AcceptInvitationProps> {
   static defaultProps: Partial<AcceptInvitationProps> = {};

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <SurfaceStyled style={styles.card}>
            <TitleMediumText style={styles.text}>
               ¡Felicitaciones! te gustas con {this.props.matchAmmount} miembros 
               de este grupo, en el próximo paso vamos organizar una cita grupal 
               entre todes.
            </TitleMediumText>
            <TitleMediumText style={styles.text}>
               Mas abajo podes explorar a los demas miembros del grupo y ver 
               quienes se gustan con quienes.
            </TitleMediumText>
            <TitleMediumText style={styles.text}>
               Si realmente tenés las ganas y pensas que podes ir a una cita 
               presiona el boton de continuar.
            </TitleMediumText>
            <Button
               mode="outlined"
               uppercase={false}
               style={[styles.button, { borderColor: colors.primary }]}
               contentStyle={styles.buttonContent}
               onPress={() => this.props.onAcceptPress()}
            >
               Quiero ir a la cita, ¡continuar!
            </Button>
         </SurfaceStyled>
      );
   }
}

const styles: Styles = StyleSheet.create({
   card: {
      paddingBottom: 20,
   },
   text: {
      fontSize: 15,
      marginBottom: 14,
   },
   button: {
      flex: 1,
   },
   buttonContent: {
      flex: 1,
      height: 44,
   }
});

export default withTheme(CardAcceptInvitation);
