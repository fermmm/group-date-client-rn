import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import BadgeExtended from "../../common/BadgeExtended/BadgeExtended";
import { useUser } from "../../../api/server/user";
import Avatar from "../../common/Avatar/Avatar";
import { ParamsRegistrationFormsPage } from "../RegistrationFormsPage/RegistrationFormsPage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";

const SettingsPage: FC = () => {
   const { navigate } = useNavigation();
   const { data: localUser } = useUser();

   if (!localUser) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <BasicScreenContainer>
            <EmptySpace height={25} />
            <List.Item
               title="Tu perfil y fotos"
               titleStyle={styles.profileIconTitle}
               left={props => (
                  <Avatar {...props} size={48} source={{ uri: localUser?.images[0] }} />
               )}
               onPress={() => navigate("Profile")}
            />
            <EmptySpace height={10} />
            <List.Item
               title="Edad y distancia"
               description="Configurar las preferencias de edad y distancia"
               left={props => (
                  <List.Icon {...props} style={styles.optionIcon} icon="arrow-left-right-bold" />
               )}
               onPress={() =>
                  navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                     formsToShow: ["FiltersForm"]
                  })
               }
            />
            <List.Item
               title="Perfil de pareja"
               description="Especificar si irías con alguien a una cita grupal"
               left={props => (
                  <List.Icon {...props} style={styles.optionIcon} icon="account-multiple" />
               )}
               onPress={() =>
                  navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                     formsToShow: ["CoupleProfileForm"]
                  })
               }
            />
            <List.Item
               title="Preferencias de género"
               description="Modifica tus preferencias de genero"
               left={props => (
                  <List.Icon {...props} style={styles.optionIcon} icon="gender-transgender" />
               )}
               onPress={() =>
                  navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                     formsToShow: ["TargetGenderForm"]
                  })
               }
            />
            <List.Item
               title="Tu lugar recomendado"
               description="Modifica tu lugar recomendado para citas grupales"
               left={props => <List.Icon {...props} style={styles.optionIcon} icon="terrain" />}
               onPress={() =>
                  navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                     formsToShow: ["DateIdeaForm"]
                  })
               }
            />
            <List.Item
               title="Leer sobre la app"
               description="Respuestas a dudas comunes y la filosofía detrás del proyecto"
               left={props => (
                  <List.Icon {...props} style={styles.optionIcon} icon="all-inclusive" />
               )}
               onPress={() => navigate("About")}
            />
            {/* 
               This must be enabled when having a lot of users:
               <List.Item
                  title="Doná para la causa"
                  description="Doná la cantidad que puedas para que podamos publicitar mejor la app."
                  left={props => 
                     <List.Icon 
                        {...props} 
                        style={styles.optionIcon} 
                        icon="rowing" 
                     />
                  }
                  onPress={() => console.log("pressed")}
               /> 
               */}
            <List.Item
               title="Chatear con nosotros"
               description="Escribinos lo que necesites: problemas, pedidos, quejas, etc."
               left={props => (
                  <View>
                     <List.Icon {...props} style={styles.optionIcon} icon="forum" />
                     <BadgeExtended amount={1} size={23} extraX={7} />
                  </View>
               )}
               onPress={() => navigate("Chat", { contactChat: true })}
            />
            {localUser.isAdmin && (
               <List.Item
                  title="Panel de admins"
                  description="Panel solo para admins"
                  left={props => (
                     <List.Icon {...props} style={styles.optionIcon} icon="shield-account" />
                  )}
                  onPress={() => navigate("Admin")}
               />
            )}
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   profileIconTitle: {
      marginLeft: 6
   },
   optionIcon: {
      marginLeft: 5,
      marginRight: 8
   }
});

export default SettingsPage;
