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
import BadgeExtended from "../../common/BadgeExtended/BadgeExtended";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { getMatchesOf } from "../../../common-tools/groups/groups-tools";
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";
import { useUser } from "../../../api/server/user";
import { useGroup } from "../../../api/server/groups";
import { useVotingResults } from "../DateVotingPage/tools/useVotingResults";

export interface ParamsGroupPage {
   group: Group;
}

const GroupPage: FC = () => {
   const { navigate } = useNavigation();
   const { data: localUser } = useUser();
   const [expandedUser, setExpandedUser] = useState<number>();
   const { params } = useRoute<RouteProps<ParamsGroupPage>>();
   const { data: groupFromServer } = useGroup({ groupId: params?.group?.groupId });
   const group: Group = groupFromServer ?? params?.group;
   const votingResults = useVotingResults(group);

   return (
      <>
         <AppBarHeader>
            <View>
               <ButtonForAppBar icon="forum" onPress={() => navigate("Chat")}>
                  Chat grupal
               </ButtonForAppBar>
               <BadgeExtended amount={3} showAtLeftSide />
            </View>
         </AppBarHeader>
         <BasicScreenContainer>
            <CardDateInfo
               day={votingResults.day}
               idea={votingResults.idea}
               onModifyVotePress={() => navigate("DateVoting", { group })}
               loading={groupFromServer == null}
            />
            <SurfaceStyled>
               <TitleText>Miembros del grupo:</TitleText>
               <List.Section>
                  {group.members.map((user, i) => (
                     <List.Accordion
                        title={toFirstUpperCase(user.name)}
                        expanded={i === expandedUser}
                        onPress={() => setExpandedUser(expandedUser !== i ? i : null)}
                        titleStyle={styles.itemTitle}
                        left={props => (
                           <Avatar {...props} size={50} source={{ uri: user.images[0] }} />
                        )}
                        key={user.userId}
                     >
                        <View style={{ paddingLeft: 0 }}>
                           <List.Section
                              title={`Se gusta con:`}
                              style={styles.subItemTitle}
                              titleStyle={styles.sectionTitle}
                           >
                              {getMatchesOf(user.userId, group).map((matchedUser, u) => (
                                 <List.Item
                                    title={toFirstUpperCase(matchedUser.name)}
                                    style={styles.subItem}
                                    key={u}
                                    onPress={() =>
                                       navigate(
                                          "Profile",
                                          localUser.userId !== matchedUser.userId
                                             ? {
                                                  user: matchedUser,
                                                  requestFullInfo: true
                                               }
                                             : null
                                       )
                                    }
                                    left={props => (
                                       <Avatar
                                          {...props}
                                          onPress={() =>
                                             navigate(
                                                "Profile",
                                                localUser.userId !== matchedUser.userId
                                                   ? {
                                                        user: matchedUser,
                                                        requestFullInfo: true
                                                     }
                                                   : null
                                             )
                                          }
                                          size={50}
                                          source={{ uri: matchedUser.images[0] }}
                                       />
                                    )}
                                 />
                              ))}
                           </List.Section>
                        </View>
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
