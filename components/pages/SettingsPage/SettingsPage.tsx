import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List, Avatar } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import BadgeExtended from "../../common/BadgeExtended/BadgeExtended";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../api/server/user";

const SettingsPage: FC = () => {
   const { navigate } = useNavigation();
   const { data: localUser, isLoading } = useUser();

   return (
      <>
         <BasicScreenContainer>
            <TitleText extraMarginLeft extraSize>
               Ajustes y otras cosas
            </TitleText>
            <EmptySpace height={25} />
            <List.Item
               title="Tu perfil y fotos"
               left={props => (
                  <Avatar.Image
                     {...props}
                     style={styles.profileIcon}
                     size={42}
                     source={{ uri: localUser?.images[0] }}
                  />
               )}
               onPress={() => navigate("Profile", { user: localUser, editMode: true })}
            />
            <EmptySpace height={10} />
            <List.Item
               title="Preguntas y filtros"
               description="Modifica la información sobre tu sexualidad y preferencias"
               left={props => (
                  <List.Icon {...props} style={styles.optionIcon} icon="account-heart" />
               )}
               onPress={() => navigate("ChangeQuestions")}
            />
            <List.Item
               title="Tu lugar recomendado"
               description="Modifica tu lugar recomendado para citas grupales"
               left={props => <List.Icon {...props} style={styles.optionIcon} icon="terrain" />}
               onPress={() => navigate("ChangeDateIdea")}
            />
            <List.Item
               title="Sobre la app y más"
               description="Te contamos sobre la app, la gente detras de su creación y más"
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
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   profileIcon: {
      marginLeft: 4,
      marginRight: 9
   },
   optionIcon: {
      marginLeft: 5,
      marginRight: 8
   }
});

export default SettingsPage;
