import React, { FC } from "react";
import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { ReportUserType } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { sendReportUser } from "../../../../api/server/user";
import { useFacebookToken } from "../../../../api/third-party/facebook/facebook-login";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { ModalTransparent } from "../../ModalTransparent/ModalTransparent";
import RadioButtonImproved from "../../RadioButtonImproved/RadioButtonImproved";
import TextInputExtended from "../../TextInputExtended/TextInputExtended";
import TitleMediumText from "../../TitleMediumText/TitleMediumText";
import TitleText from "../../TitleText/TitleText";

interface PropsMoreModal {
   userToReportId: string;
   onClose: () => void;
}

const MoreModal: FC<PropsMoreModal> = ({ onClose, userToReportId }) => {
   const maxCharactersAllowed: number = 4000;
   const [requestLoading, setRequestLoading] = useState(false);
   const [notes, setNotes] = useState<string>();
   const [reportType, setReportType] = useState<ReportUserType>();
   const { token, isLoading: tokenLoading } = useFacebookToken();
   const isLoading = tokenLoading || requestLoading;

   const handleSendReport = async () => {
      if (reportType == null) {
         onClose();
         return;
      }

      setRequestLoading(true);
      await sendReportUser({ token, reportedUserId: userToReportId, reportType, notes });
      setRequestLoading(false);
      onClose();
   };

   const getError = (): string => {
      if (notes?.length > maxCharactersAllowed) {
         return (
            "Te has pasado del máximo de caracteres permitidos por " +
            (notes.length - maxCharactersAllowed) +
            " caracteres"
         );
      }
   };

   return (
      <ModalTransparent onClose={onClose}>
         <View style={[styles.mainContainer, !requestLoading ? { paddingBottom: 25 } : null]}>
            {isLoading ? (
               <LoadingAnimation />
            ) : (
               <ScrollView contentContainerStyle={styles.contentContainer}>
                  <>
                     <TitleText style={styles.title}>Reportar</TitleText>
                     <View style={styles.radioButtonsContainer}>
                        <RadioButtonImproved
                           checked={reportType === ReportUserType.MissingPicture}
                           onPress={() => setReportType(ReportUserType.MissingPicture)}
                           style={styles.radioButton}
                        >
                           <Text style={styles.responseText}>No hay foto de la persona</Text>
                           <Text style={styles.responseExtraText}>
                              Con más reportes será invisible hasta que suba una foto
                           </Text>
                        </RadioButtonImproved>
                        <RadioButtonImproved
                           checked={reportType === ReportUserType.NonEthical}
                           onPress={() => setReportType(ReportUserType.NonEthical)}
                           style={styles.radioButton}
                        >
                           <Text style={styles.responseText}>Perfil no ético</Text>
                           <Text style={styles.responseExtraText}>
                              Revisaremos la situación y la persona será bloqueada de la app
                           </Text>
                        </RadioButtonImproved>
                     </View>
                     {reportType != null && (
                        <View style={styles.commentsContainer}>
                           <TitleMediumText>Comentarios (opcional)</TitleMediumText>
                           <TextInputExtended
                              errorText={getError()}
                              mode="outlined"
                              multiline={true}
                              value={notes}
                              onChangeText={t => setNotes(t)}
                              style={{
                                 height: 100
                              }}
                           />
                        </View>
                     )}
                  </>
               </ScrollView>
            )}
            {reportType != null && !isLoading && (
               <View
                  style={{
                     flexDirection: "row",
                     justifyContent: "center"
                  }}
               >
                  <Button
                     onPress={handleSendReport}
                     mode="outlined"
                     color={currentTheme.colors.accent2}
                     style={styles.button}
                  >
                     {"Enviar"}
                  </Button>
               </View>
            )}
         </View>
      </ModalTransparent>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "90%",
      backgroundColor: currentTheme.colors.background,
      borderRadius: currentTheme.roundnessSmall,
      marginTop: 50,
      marginBottom: 50
   },
   contentContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 25,
      paddingBottom: 25
   },
   radioButtonsContainer: { marginBottom: 25 },
   title: { marginBottom: 30 },
   responseText: {
      fontSize: 17
   },
   commentsContainer: {
      width: "100%",
      paddingLeft: 18,
      paddingRight: 18
   },
   responseExtraText: {
      fontSize: 15,
      fontFamily: currentTheme.font.light
   },
   button: {
      borderColor: currentTheme.colors.accent2,
      minWidth: 180
   },
   radioButton: {
      paddingLeft: 40,
      paddingRight: 50
   }
});

export default MoreModal;
