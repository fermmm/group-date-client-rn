import React, { FC, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import TextInputExtended from "../../common/TextInputExtended/TextInputExtended";
import { Button } from "react-native-paper";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { useUser } from "../../../api/server/user";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { sendCreateFakeUsers, sendForceGroupsSearch } from "../../../api/server/admin";
import EmptySpace from "../../common/EmptySpace/EmptySpace";

const AdminPage: FC = () => {
   const { colors } = useTheme();
   const { data: localUser } = useUser();
   const [fakeUsersAmount, setFakeUsersAmount] = useState<string>();

   const handleCreateTestUsersPress = async () => {
      const response = await sendCreateFakeUsers({ token: localUser.token, text: fakeUsersAmount });
      Alert.alert("Hecho, respuesta:", response);
   };

   const handleSearchGroupsPress = async () => {
      const response = await sendForceGroupsSearch();
      Alert.alert("Hecho, respuesta:", response);
   };

   if (!localUser) {
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
            <Button onPress={handleCreateTestUsersPress} mode="outlined" color={colors.accent2}>
               Enviar
            </Button>
            <EmptySpace />
            <Button onPress={handleSearchGroupsPress} mode="outlined" color={colors.accent2}>
               Forzar búsqueda de grupos
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
