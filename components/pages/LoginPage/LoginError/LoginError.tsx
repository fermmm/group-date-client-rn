import React, { FC } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { WEBSITE_URL } from "../../../../env.config";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";

interface PropsErrorText {
   error?: string;
}

const LoginError: FC<PropsErrorText> = props => {
   const { error } = props;
   const { colors } = useTheme();

   return (
      <View style={styles.mainContainer}>
         <Text style={styles.textBlock}>
            {error ??
               "No se puede conectar con el servidor, intenta mas tarde y si el problema persiste actualiza la app o buscanos en las redes sociales para saber si hubo algún problema"}
         </Text>
         <ButtonStyled
            color={colors.textLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
            onPress={() => {
               Linking.openURL(WEBSITE_URL);
            }}
         >
            Web de GroupDate
         </ButtonStyled>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      width: "100%"
   },
   textBlock: {
      textAlign: "center",
      fontFamily: currentTheme.font.medium,
      color: currentTheme.colors.textLogin,
      fontSize: 15,
      marginBottom: 40
   },
   button: {
      borderColor: currentTheme.colors.textLogin,
      width: "100%",
      marginBottom: 80
   },
   buttonContent: {
      justifyContent: "center"
   }
});

export default LoginError;
