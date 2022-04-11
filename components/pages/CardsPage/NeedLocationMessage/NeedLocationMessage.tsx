import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import { currentTheme } from "../../../../config";
import { useUser } from "../../../../api/server/user";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { sendLocationDataToServer } from "../tools/sendLocationDataToServer";

interface PropsNeedLocationMessage {}

const NeedLocationMessage: FC<PropsNeedLocationMessage> = () => {
   const { data: user } = useUser();
   const { token } = useAuthentication();
   const { colors } = useTheme();

   // Effect to request permission to use location without the user pressing the allow button
   useEffect(() => {
      handleAllowButtonPress();
   }, []);

   const handleAllowButtonPress = async () => {
      await sendLocationDataToServer({
         token,
         user,
         settings: {
            errorMessageCancellable: true,
            enableBackupCoords: false
         }
      });
   };

   if (!user) {
      return <LoadingAnimation centeredMethod={CenteredMethod.Absolute} />;
   }

   return (
      <BasicScreenContainer>
         <View style={styles.mainContainer}>
            <Text style={styles.text}>
               Permite acceder a tu ubicación para ver personas cercanas.
            </Text>
            <EmptySpace />
            <ButtonStyled color={colors.accent2} onPress={handleAllowButtonPress}>
               Permitir ubicación
            </ButtonStyled>
         </View>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 20
   },
   text: {
      fontSize: 17,
      fontFamily: currentTheme.font.light
   }
});

export default NeedLocationMessage;
