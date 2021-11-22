import React, { FC } from "react";
import { StyleSheet, Linking } from "react-native";
import Clipboard from "expo-clipboard";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Button, Text } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { currentTheme } from "../../../config";
import { useGoBackExtended } from "../../../common-tools/navigation/useGoBackExtended";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

const ContactPage: FC = () => {
   const { goBack } = useGoBackExtended({
      whenBackNotAvailable: { goToRoute: "Main" }
   });
   const { colors } = useTheme();

   const handleCollaborationGroupPress = () => {
      Linking.openURL("https://www.facebook.com/groups/133790728893669");
   };
   const handleInstagramAccountPress = () => {
      Linking.openURL("https://www.instagram.com/poly.community.app");
   };
   const handleFacebookAccountPress = () => {
      Linking.openURL("https://www.facebook.com/polycommunityapp");
   };
   const handleCopyEmailPress = () => {
      Clipboard?.setString?.("poly.app.team@gmail.com");
   };
   const handleSendEmailPress = () => {
      Linking.openURL("mailto:poly.app.team@gmail.com");
   };
   const handleWebPress = () => {
      Linking.openURL("https://polycommunity.app");
   };

   return (
      <>
         <AppBarHeader onBackPress={goBack} />
         <BasicScreenContainer style={styles.mainContainer}>
            <TitleText extraSize style={styles.title}>
               Grupo de Facebook para intercambiar ideas y aportes
            </TitleText>
            <EmptySpace height={15} />
            <Button onPress={handleCollaborationGroupPress} mode="text" color={colors.accent2}>
               Visitar grupo de Facebook
            </Button>
            <EmptySpace height={15} />
            <TitleText extraSize style={styles.title}>
               Nuestras cuentas en redes sociales
            </TitleText>
            <Text style={styles.text}>
               Si nos quieres enviar un mensaje directo puedes usar estas cuentas
            </Text>
            <EmptySpace height={15} />
            <Button onPress={handleInstagramAccountPress} mode="text" color={colors.accent2}>
               Instagram
            </Button>
            <Button onPress={handleFacebookAccountPress} mode="text" color={colors.accent2}>
               Facebook
            </Button>
            <EmptySpace height={15} />
            <TitleText extraSize style={styles.title}>
               Nuestro email
            </TitleText>
            <Text style={styles.text}>Nuestro email es:</Text>
            <Text style={styles.text}>poly.app.team@gmail.com</Text>
            <EmptySpace height={15} />
            <Button onPress={handleCopyEmailPress} mode="text" color={colors.accent2}>
               Copiar email
            </Button>
            <Button onPress={handleSendEmailPress} mode="text" color={colors.accent2}>
               Enviar email
            </Button>
            <TitleText extraSize style={styles.title}>
               Nuestra web
            </TitleText>
            <EmptySpace height={15} />
            <Button onPress={handleWebPress} mode="text" color={colors.accent2}>
               Visitar
            </Button>
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      paddingLeft: 18,
      paddingRight: 18
   },
   title: {
      fontFamily: currentTheme.font.extraLight,
      fontSize: 24,
      lineHeight: 28,
      marginBottom: 25,
      marginTop: 25
   },
   text: {
      fontSize: 16,
      lineHeight: 21
   }
});

export default ContactPage;
