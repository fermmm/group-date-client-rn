import React, { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useIsFocused, useRoute } from "@react-navigation/native";
import { Button, List, Text } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import Avatar from "../../common/Avatar/Avatar";
import SurfaceStyled from "../../common/SurfaceStyled/SurfaceStyled";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import {
   currentTheme,
   UNREAD_CHAT_BADGE_REFRESH_INTERVAL,
   VOTING_RESULT_REFRESH_INTERVAL
} from "../../../config";
import CardDateInfo from "./CardDateInfo/CardDateInfo";
import ButtonForAppBar from "../../common/ButtonForAppBar/ButtonForAppBar";
import BadgeExtended from "../../common/BadgeExtended/BadgeExtended";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { getMatchesOf } from "../../../common-tools/groups/groups-tools";
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";
import { useUser } from "../../../api/server/user";
import {
   useGroup,
   useUnreadMessagesAmount,
   useUserGroupList,
   useVoteResults
} from "../../../api/server/groups";
import { useVotingResultToRender } from "../DateVotingPage/tools/useVotingResults";
import { revalidate } from "../../../api/tools/useCache/useCache";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { useGoBackExtended } from "../../../common-tools/navigation/useGoBackExtended";
import { analyticsLogEvent } from "../../../common-tools/analytics/tools/analyticsLog";
import { useGroupSeenChecker } from "../GroupsListPage/tools/useGroupSeenChecker";
import { useServerInfo } from "../../../api/server/server-info";
import { getSlotStatusInfoText } from "../GroupsListPage/tools/getSlotsInfoText";

export interface ParamsGroupPage {
   groupId: string;
}

const GroupPage: FC = () => {
   const { navigate } = useNavigation();
   const focused = useIsFocused();
   const { data: localUser } = useUser();
   const { data: groups } = useUserGroupList();
   const { data: serverInfo } = useServerInfo();
   let slotsStatusInfoText = getSlotStatusInfoText(serverInfo, groups);
   const [expandedUser, setExpandedUser] = useState<number>();
   const { params } = useRoute<RouteProps<ParamsGroupPage>>();
   const { data: group } = useGroup({ groupId: params?.groupId });
   const { data: voteResultsFromServer } = useVoteResults({
      groupId: params?.groupId,
      config: { refreshInterval: VOTING_RESULT_REFRESH_INTERVAL }
   });
   const votingResults = useVotingResultToRender(group, voteResultsFromServer);
   const { data: unreadChatMessages } = useUnreadMessagesAmount({
      groupId: params?.groupId,
      config: { refreshInterval: UNREAD_CHAT_BADGE_REFRESH_INTERVAL, enabled: focused }
   });
   useGroupSeenChecker();
   const isLoading = group == null;

   useFocusEffect(
      useCallback(() => {
         revalidate("group/chat/unread/amount" + params?.groupId);
         analyticsLogEvent("group_page_opened");
      }, [])
   );

   const { goBack } = useGoBackExtended({
      whenBackNotAvailable: { goToRoute: "Main" }
   });

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <AppBarHeader onBackPress={goBack}>
            <View>
               <ButtonForAppBar
                  icon="forum"
                  onPress={() => navigate("Chat", { groupId: group.groupId })}
               >
                  Chat grupal
               </ButtonForAppBar>
               <BadgeExtended amount={unreadChatMessages?.unread ?? 0} showAtLeftSide />
            </View>
         </AppBarHeader>
         <BasicScreenContainer>
            <SurfaceStyled>
               <TitleText>Chat grupal</TitleText>
               {unreadChatMessages?.unread > 0 && (
                  <Text style={styles.textNormal}>
                     Hay {unreadChatMessages?.unread} mensajes sin leer
                  </Text>
               )}
               <Button
                  uppercase={false}
                  onPress={() => navigate("Chat", { groupId: group.groupId })}
               >
                  Ver chat grupal
               </Button>
            </SurfaceStyled>
            {slotsStatusInfoText != null && (
               <SurfaceStyled>
                  <TitleText>Próximo grupo</TitleText>
                  <Text style={styles.textNormal}>{slotsStatusInfoText}</Text>
               </SurfaceStyled>
            )}
            <CardDateInfo
               day={votingResults?.day}
               idea={votingResults?.idea}
               onModifyVotePress={() => navigate("DateVoting", { group })}
               loading={voteResultsFromServer == null}
            />
            {group.showRemoveSeenMenu === true && (
               <SurfaceStyled>
                  <TitleText>¿A quienes quieres volver a ver en tu próxima cita?</TitleText>
                  <Button
                     uppercase={false}
                     onPress={() => navigate("RemoveSeenWizardPage", { groupId: group.groupId })}
                  >
                     Elegir
                  </Button>
               </SurfaceStyled>
            )}
            <SurfaceStyled>
               <TitleText>Miembros del grupo</TitleText>
               <List.Section>
                  {group.members?.map((user, i) => (
                     <List.Accordion
                        title={toFirstUpperCase(user.name)}
                        expanded={i === expandedUser}
                        onPress={() => setExpandedUser(expandedUser !== i ? i : null)}
                        titleStyle={styles.itemTitle}
                        left={props => <Avatar {...props} size={50} source={user?.images?.[0]} />}
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
                                          source={matchedUser?.images?.[0]}
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
   textNormal: {
      fontFamily: currentTheme.font.light,
      fontSize: 15,
      flex: 1,
      flexWrap: "wrap"
   },
   subItem: {
      paddingLeft: 26
   }
});

export default GroupPage;
