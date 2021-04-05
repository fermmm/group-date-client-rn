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
import {
   sendCreateFakeTags,
   sendCreateFakeUsers,
   sendForceGroupsSearch
} from "../../../api/server/admin";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import { LocalStorageKey } from "../../../common-tools/strings/LocalStorageKey";
import { removeFromDevice } from "../../../common-tools/device-native-api/storage/storage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import SurfaceStyled from "../../common/SurfaceStyled/SurfaceStyled";

const AdminPage: FC = () => {
   const { colors } = useTheme();
   const { data: localUser } = useUser();
   const [fakeUsersAmount, setFakeUsersAmount] = useState<string>("5");
   const [fakeTagsAmount, setFakeTagsAmount] = useState<string>("40");
   const { navigate } = useNavigation();

   const handleCreateFakeUsersPress = async () => {
      const response = await sendCreateFakeUsers({ token: localUser.token, text: fakeUsersAmount });
      Alert.alert("Hecho, respuesta:", response);
   };

   const handleSearchGroupsPress = async () => {
      const response = await sendForceGroupsSearch({ token: localUser.token });
      Alert.alert("Hecho, respuesta:", response);
   };

   const handleRemoveLocalStorage = async () => {
      Object.values(LocalStorageKey).forEach(value => {
         removeFromDevice(value);
         removeFromDevice(value, { secure: true });
      });
   };

   const handleCreateFakeTagsPress = async () => {
      const response = await sendCreateFakeTags({ token: localUser.token, text: fakeTagsAmount });
      Alert.alert("Hecho, respuesta:", response);
   };

   const handleTemp = () => {
      navigate("WelcomeTour");
   };

   if (!localUser) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <AppBarHeader />
         <BasicScreenContainer style={styles.mainContainer}>
            <SurfaceStyled>
               <TextInputExtended
                  title="Crear usuarios de prueba, cantidad:"
                  mode="outlined"
                  keyboardType="number-pad"
                  value={fakeUsersAmount}
                  onChangeText={t => setFakeUsersAmount(t)}
               />
               <Button onPress={handleCreateFakeUsersPress} mode="outlined" color={colors.accent2}>
                  Enviar
               </Button>
               <EmptySpace />
               <Button onPress={handleSearchGroupsPress} mode="outlined" color={colors.accent2}>
                  Forzar buscar grupos
               </Button>
            </SurfaceStyled>

            <EmptySpace height={30} />
            <SurfaceStyled>
               <TextInputExtended
                  title="Crear tags de prueba, cantidad:"
                  mode="outlined"
                  keyboardType="number-pad"
                  value={fakeTagsAmount}
                  onChangeText={t => setFakeTagsAmount(t)}
               />
               <Button onPress={handleCreateFakeTagsPress} mode="outlined" color={colors.accent2}>
                  Enviar
               </Button>
            </SurfaceStyled>
            <EmptySpace height={80} />
            <Button onPress={handleTemp} mode="outlined" color={colors.accent2}>
               temp
            </Button>
            <EmptySpace height={30} />
            <Button onPress={handleRemoveLocalStorage} mode="outlined" color={colors.accent2}>
               Borrar local storage
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
