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
import { LocalStorageKey } from "../../../common-tools/strings/LocalStorageKey";
import { removeFromDevice } from "../../../common-tools/device-native-api/storage/storage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";

const AdminPage: FC = () => {
   const { colors } = useTheme();
   const { data: localUser } = useUser();
   const [fakeUsersAmount, setFakeUsersAmount] = useState<string>();
   const { navigate } = useNavigation();

   const handleCreateTestUsersPress = async () => {
      const response = await sendCreateFakeUsers({ token: localUser.token, text: fakeUsersAmount });
      Alert.alert("Hecho, respuesta:", response);
   };

   const handleSearchGroupsPress = async () => {
      const response = await sendForceGroupsSearch();
      Alert.alert("Hecho, respuesta:", response);
   };

   const handleRemoveLocalStorage = async () => {
      Object.values(LocalStorageKey).forEach(value => {
         removeFromDevice(value);
         removeFromDevice(value, { secure: true });
      });
   };

   const handleTemp = () => {
      navigate("Main", {
         screen: "Notifications"
      });
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
            <EmptySpace height={100} />
            <Button onPress={handleRemoveLocalStorage} mode="outlined" color={colors.accent2}>
               Borrar local storage
            </Button>
            <EmptySpace height={100} />
            <Button onPress={handleTemp} mode="outlined" color={colors.accent2}>
               temp
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
