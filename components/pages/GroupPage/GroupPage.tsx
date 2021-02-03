import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { List } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import Avatar from "../../common/Avatar/Avatar";
import SurfaceStyled from "../../common/SurfaceStyled/SurfaceStyled";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import { currentTheme } from "../../../config";
import CardDateInfo from "./CardDateInfo/CardDateInfo";
import ButtonForAppBar from "../../common/ButtonForAppBar/ButtonForAppBar";
import CardAcceptInvitation from "./CardAcceptInvitation/CardAcceptInvitation";
import BadgeExtended from "../../common/BadgeExtended/BadgeExtended";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { getMatchesOf } from "../../../common-tools/groups/groups-tools";

export interface ParamsGroupPage {
   group: Group;
}

const GroupPage: FC = () => {
   const { navigate } = useNavigation();
   const [expandedUser, setExpandedUser] = useState(-1);
   const { params } = useRoute<RouteProps<ParamsGroupPage>>();
   const group: Group = params?.group;

   // TODO: Remove this
   const invitationAccepted: boolean = true;

   return (
      <>
         <AppBarHeader title={invitationAccepted ? "Grupo" : "Invitación a una cita"}>
            {invitationAccepted && (
               <View>
                  <ButtonForAppBar icon="forum" onPress={() => navigate("Chat")}>
                     Chat grupal
                  </ButtonForAppBar>
                  <BadgeExtended amount={3} showAtLeftSide />
               </View>
            )}
         </AppBarHeader>
         <BasicScreenContainer>
            {!invitationAccepted && (
               <CardAcceptInvitation
                  matchAmount={3}
                  onAcceptPress={() => navigate("DateVoting", { group })}
               />
            )}
            {invitationAccepted && (
               <CardDateInfo onModifyVotePress={() => navigate("DateVoting", { group })} />
            )}
            <SurfaceStyled>
               <TitleText>Miembros del grupo:</TitleText>
               <List.Section>
                  {group.members.map((user, i) => (
                     <List.Accordion
                        title={user.name}
                        expanded={i === expandedUser}
                        onPress={() => setExpandedUser(expandedUser !== i ? i : -1)}
                        titleStyle={styles.itemTitle}
                        left={props => (
                           <Avatar {...props} size={50} source={{ uri: user.images[0] }} />
                        )}
                        key={i}
                     >
                        <List.Section
                           title="Se gusta con:"
                           style={styles.subItemTitle}
                           titleStyle={styles.sectionTitle}
                        >
                           {getMatchesOf(user.userId, group).map((matchedUser, u) => (
                              <List.Item
                                 title={matchedUser.name}
                                 style={styles.subItem}
                                 key={u}
                                 onPress={() => navigate("Profile", { user: matchedUser })}
                                 left={props => (
                                    <Avatar
                                       {...props}
                                       onPress={() => navigate("Profile", { user: matchedUser })}
                                       size={50}
                                       source={{ uri: matchedUser.images[0] }}
                                    />
                                 )}
                              />
                           ))}
                        </List.Section>
                     </List.Accordion>
                  ))}
               </List.Section>
            </SurfaceStyled>
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   itemTitle: {
      textAlign: "center"
   },
   subItemTitle: {
      paddingLeft: 10
   },
   sectionTitle: {
      fontFamily: currentTheme.font.regular,
      fontSize: 15
   },
   subItem: {
      paddingLeft: 26
   }
});

export default GroupPage;
