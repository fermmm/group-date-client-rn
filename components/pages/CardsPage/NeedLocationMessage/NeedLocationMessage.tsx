import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import EmptySpace from "../../../common/EmptySpace/EmptySpace";
import { currentTheme } from "../../../../config";
import { sendUserProps, useUser } from "../../../../api/server/user";
import {
   CenteredMethod,
   LoadingAnimation
} from "../../../common/LoadingAnimation/LoadingAnimation";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { getGeolocationPosition } from "../../../../common-tools/device-native-api/geolocation/getGeolocationPosition";
import { useAuthentication } from "../../../../api/authentication/useAuthentication";
import { askGeolocationPermission } from "../../../../common-tools/device-native-api/geolocation/askGeolocationPermission";

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
      const permissionGranted = await askGeolocationPermission({
         allowContinueWithoutAccepting: true,
         insistOnAcceptingOnce: true
      });

      if (!permissionGranted) {
         return;
      }

      const coords = await getGeolocationPosition({
         allowContinueWithGeolocationDisabled: false
      });

      if (coords?.latitude == null || coords?.longitude == null) {
         return;
      }

      await sendUserProps({
         token,
         props: { locationLat: coords.latitude, locationLon: coords.longitude },
         updateProfileCompletedProp: false
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
