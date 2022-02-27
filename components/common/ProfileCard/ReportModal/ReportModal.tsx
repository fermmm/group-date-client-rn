import React, { FC } from "react";
import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { ReportUserType } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { sendBlockUser, sendReportUser } from "../../../../api/server/user";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { ModalTransparent } from "../../ModalTransparent/ModalTransparent";
import RadioButtonImproved from "../../RadioButtonImproved/RadioButtonImproved";
import TextInputExtended from "../../TextInputExtended/TextInputExtended";
import TitleMediumText from "../../TitleMediumText/TitleMediumText";
import TitleText from "../../TitleText/TitleText";
import CheckboxButton from "../../CheckboxButton/CheckboxButton";
import { refreshCards } from "../../../pages/CardsPage/tools/refreshCards";
import I18n from "i18n-js";

interface PropsReportModal {
   targetUserId: string;
   onClose: () => void;
}

const ReportModal: FC<PropsReportModal> = ({ onClose, targetUserId }) => {
   const maxCharactersAllowed: number = 4000;
   const [requestLoading, setRequestLoading] = useState(false);
   const [blockUser, setBlockUser] = useState(false);
   const [notes, setNotes] = useState<string>();
   const [reportType, setReportType] = useState<ReportUserType>();
   const { token, isLoading: tokenLoading } = useAuthentication();
   const isLoading = tokenLoading || requestLoading;

   const handleSendReport = async () => {
      setRequestLoading(true);

      if (reportType != null) {
         await sendReportUser({ token, reportedUserId: targetUserId, reportType, notes });
      }

      // Non ethical reporting also blocks user
      if (blockUser || reportType === ReportUserType.NonEthical) {
         await sendBlockUser({ token, targetUserId });
         refreshCards();
      }

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
                     <TitleText style={styles.title}>{I18n.t("Report and/or block")} </TitleText>
                     <View style={styles.radioButtonsContainer}>
                        <CheckboxButton
                           checked={blockUser}
                           onPress={() => setBlockUser(!blockUser)}
                           style={styles.radioButton}
                        >
                           <Text style={styles.responseText}>{I18n.t("Block")}</Text>
                        </CheckboxButton>
                        <RadioButtonImproved
                           checked={reportType === ReportUserType.MissingPicture}
                           onPress={() =>
                              setReportType(type =>
                                 type === ReportUserType.MissingPicture
                                    ? null
                                    : ReportUserType.MissingPicture
                              )
                           }
                           style={styles.radioButton}
                        >
                           <Text style={styles.responseText}>
                              {I18n.t("There is no photo of the person")}
                           </Text>
                           <Text style={styles.responseExtraText}>
                              {I18n.t(
                                 "The user will be prompted to upload a photo to continue using the app"
                              )}
                           </Text>
                        </RadioButtonImproved>
                        <RadioButtonImproved
                           checked={reportType === ReportUserType.NonEthical}
                           onPress={() =>
                              setReportType(type =>
                                 type === ReportUserType.NonEthical
                                    ? null
                                    : ReportUserType.NonEthical
                              )
                           }
                           style={styles.radioButton}
                        >
                           <Text style={styles.responseText}>{I18n.t("Unethical profile")}</Text>
                           <Text style={styles.responseExtraText}>
                              {I18n.t(
                                 "The profile contains unethical elements or violates our community guidelines"
                              )}
                           </Text>
                        </RadioButtonImproved>
                     </View>
                     {reportType != null && (
                        <View style={styles.commentsContainer}>
                           <TitleMediumText>
                              {I18n.t("Comments")} ({I18n.t("optional")})
                           </TitleMediumText>
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
            {(reportType != null || blockUser) && !isLoading && (
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
                     {I18n.t("Send")}
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
      backgroundColor: currentTheme.colors.backgroundBottomGradient,
      borderRadius: currentTheme.roundnessSmall,
      marginTop: 50,
      marginBottom: 50
   },
   contentContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 25,
      paddingBottom: 25,
      width: "100%"
   },
   radioButtonsContainer: {
      marginBottom: 25,
      width: "100%"
   },
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
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20
   }
});

export default ReportModal;
