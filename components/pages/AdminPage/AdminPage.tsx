import React, { FC, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import { Button } from "react-native-paper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useCreateFakeUsersMutation } from "../../../api/server/admin";
import { useUser } from "../../../api/server/user";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";

const AdminPage: FC = () => {
   const { colors } = useTheme();
   const { data: localUser, isLoading: userIsLoading } = useUser();
   const { mutateAsync, isLoading: testEndpointLoading } = useCreateFakeUsersMutation();
   const [fakeUsersAmount, setFakeUsersAmount] = useState<string>();

   const handleSend = async () => {
      const response = await mutateAsync({ token: localUser.token, text: fakeUsersAmount });
      Alert.alert("Hecho, respuesta:", response);
   };

   if (userIsLoading || testEndpointLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <AppBarHeader />
         <BasicScreenContainer style={styles.mainContainer}>
            <TextInputExtended
               title="Crear usuarios de prueba, cantidad:"
               mode="outlined"
               keyboardType="number-pad"
               value={fakeUsersAmount}
               onChangeText={t => setFakeUsersAmount(t)}
            />
            <Button onPress={handleSend} mode="outlined" color={colors.accent2}>
               Enviar
            </Button>
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      paddingLeft: 18,
      paddingRight: 18
   }
});

export default AdminPage;
