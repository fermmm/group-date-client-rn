import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../../../common/SurfaceStyled/SurfaceStyled";
import TitleText from "../../../common/TitleText/TitleText";
import { currentTheme } from "../../../../config";
import { LoadingAnimation } from "../../../common/LoadingAnimation/LoadingAnimation";

export interface DateInfoProps {
   day?: string;
   idea?: string;
   onModifyVotePress: () => void;
   loading?: boolean;
}
export interface DateInfoState {}

const CardDateInfo: FC<DateInfoProps> = ({ day, idea, onModifyVotePress, loading }) => {
   return (
      <SurfaceStyled>
         {loading ? (
            <LoadingAnimation />
         ) : (
            <>
               {(day != null || idea != null) && <TitleText>Cita más votada:</TitleText>}
               {day == null && idea == null && (
                  <View style={styles.row}>
                     <Text style={styles.textNormal}>
                        Puedes votar idea y día para la cita y lo verán los demás. De momento no hay
                        votos.
                     </Text>
                  </View>
               )}
               {day != null && (
                  <View style={styles.row}>
                     <Text style={styles.textHighlighted}>Día:</Text>
                     <Text style={styles.textNormal}>{day}</Text>
                  </View>
               )}
               {idea != null && (
                  <View style={styles.row}>
                     <Text style={styles.textHighlighted}>Idea:</Text>
                     <Text style={styles.textNormal}>{idea}</Text>
                  </View>
               )}
               <Button uppercase={false} onPress={() => onModifyVotePress()}>
                  VOTAR
               </Button>
            </>
         )}
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
