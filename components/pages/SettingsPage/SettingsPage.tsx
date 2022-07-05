import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { ActivityAction } from "expo-intent-launcher";
import moment from "moment";
import { openDeviceAction } from "../../../common-tools/device-native-api/device-action/openDeviceAction";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import { useUser } from "../../../api/server/user";
import Avatar from "../../common/Avatar/Avatar";
import { ParamsRegistrationFormsPage } from "../RegistrationFormsPage/RegistrationFormsPage";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { currentTheme } from "../../../config";
import { getAppVersion } from "../../../common-tools/device-native-api/versions/versions";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import { useAccountDelete } from "./tools/useAccountDelete";
import LegalLinks from "../LoginPage/LegalLinks/LegalLinks";
import { useDialogModal } from "../../common/DialogModal/tools/useDialogModal";
import { DAY_IN_SECONDS } from "../../../api/tools/date-tools";
import { humanizeUnixTime } from "../../../common-tools/strings/humanizeUnixTime";

const SettingsPage: FC = () => {
   const { navigate } = useNavigation();
   const { logout } = useAuthentication();
   const { data: localUser } = useUser();
   const { handleAccountDelete, isLoading: accountDeleteLoading } = useAccountDelete();
   const { openDialogModal } = useDialogModal();
   const ALLOW_COUPLE_PROFILE_CHANGE_AFTER_DAYS = 10;

   if (!localUser || accountDeleteLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <BasicScreenContainer>
         <EmptySpace height={25} />
         <List.Item
            title="Tu perfil y fotos"
            titleStyle={styles.profileIconTitle}
            left={props => <Avatar {...props} size={48} source={localUser?.images?.[0]} />}
            onPress={() => navigate("Profile", { editMode: true })}
         />
         <EmptySpace height={10} />
         <List.Item
            title="Edad y distancia"
            description="Elige que personas verás según su edad y distancia"
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
            title="Preferencias de género"
            description="Elige que géneros quieres ver"
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
            title="Perfil de pareja"
            description="Especificar si irías con alguien a una cita grupal"
            left={props => (
               <List.Icon {...props} style={styles.optionIcon} icon="account-multiple" />
            )}
            onPress={() =>
               (localUser.coupleProfileLastChangeDate ?? 0) <
                  moment().unix() - DAY_IN_SECONDS * ALLOW_COUPLE_PROFILE_CHANGE_AFTER_DAYS ||
               localUser.isAdmin
                  ? navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                       questionToShow: ["q05"]
                    })
                  : openDialogModal({
                       message: `Se puede cambiar el tipo de perfil cada ${ALLOW_COUPLE_PROFILE_CHANGE_AFTER_DAYS} días, dentro de ${humanizeUnixTime(
                          DAY_IN_SECONDS * ALLOW_COUPLE_PROFILE_CHANGE_AFTER_DAYS -
                             (moment().unix() - (localUser.coupleProfileLastChangeDate ?? 0))
                       )} lo podrás cambiar`,
                       buttons: [{ label: "Entendido" }]
                    })
            }
         />
         <List.Item
            title="Tu idea recomendada"
            description="Modifica idea recomendada para citas grupales"
            left={props => <List.Icon {...props} style={styles.optionIcon} icon="terrain" />}
            onPress={() =>
               navigate<ParamsRegistrationFormsPage>("RegistrationForms", {
                  formsToShow: ["DateIdeaForm"]
               })
            }
         />
         <List.Item
            title="Notificaciones"
            description="Preferencias de las notificaciones push"
            left={props => (
               <List.Icon {...props} style={styles.optionIcon} icon="cellphone-sound" />
            )}
            onPress={() =>
               openDeviceAction(ActivityAction.APP_NOTIFICATION_SETTINGS, "app-settings:")
            }
         />
         <List.Item
            title="Leer sobre la app"
            description="Respuestas a dudas comunes y la filosofía detrás del proyecto"
            left={props => <List.Icon {...props} style={styles.optionIcon} icon="all-inclusive" />}
            onPress={() => navigate("About")}
         />
         {/* 
               This must be enabled when having a lot of users:
               <List.Item
                  title="Dona para la causa y verás más personas"
                  description="Automáticamente va a publicidad en la ciudad y géneros deseados de cada persona que dona."
                  left={props => 
                     <List.Icon 
                        {...props} 
                        style={styles.optionIcon} 
                        icon="rowing" 
                     />
                  }
                  onPress={() => {}}
               /> 
               */}
         {/* 
            Unfinished section:
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
         /> */}
         <List.Item
            title="Participa y contáctanos"
            description="Descubre nuestros canales de participación y comunicación"
            left={props => <List.Icon {...props} style={styles.optionIcon} icon="forum" />}
            onPress={() => navigate("ContactPage")}
         />
         <List.Item
            title="Cerrar sesión"
            description="Tendrás que volver a hacer login para seguir usando la app"
            left={props => <List.Icon {...props} style={styles.optionIcon} icon="exit-run" />}
            onPress={logout}
         />
         <List.Item
            title="Eliminar tu cuenta"
            description="Eliminar todos tus datos en la app"
            left={props => (
               <List.Icon {...props} style={styles.optionIcon} icon="trash-can-outline" />
            )}
            onPress={handleAccountDelete}
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
         <EmptySpace />
         <LegalLinks />
         <View style={styles.versionsContainer}>
            <Text style={styles.versionText}>Code version: {getAppVersion().codeVersion}</Text>
            <Text style={styles.versionText}>App version: {getAppVersion().buildVersion}</Text>
         </View>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   profileIconTitle: {
      marginLeft: 6
   },
   optionIcon: {
      marginLeft: 5,
      marginRight: 8
   },
   versionText: {
      fontFamily: currentTheme.font.light,
      textAlign: "center",
      marginTop: 5
   },
   versionsContainer: {
      marginTop: 20,
      marginBottom: 20
   }
});

export default SettingsPage;
