import React, { FC, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List } from "react-native-paper";
import GraphSvg2 from "../../../assets/GraphSvg2";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import EmptyPageMessage from "../../common/EmptyPageMessage/EmptyPageMessage";
import { useUserGroupList } from "../../../api/server/groups";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { firstBy } from "thenby";
import { useServerInfo } from "../../../api/server/server-info";
import { getSlotStatusInfoText } from "./tools/getSlotsInfoText";
import { useGroupSeenChecker } from "./tools/useGroupSeenChecker";

const GroupsListPage: FC = () => {
   const { navigate } = useNavigation();
   const { data: groups } = useUserGroupList();
   const { data: serverInfo } = useServerInfo();
   const slotsStatusInfoText = getSlotStatusInfoText(serverInfo, groups);
   useGroupSeenChecker();

   if (groups == null || groups?.length === 0) {
      return (
         <EmptyPageMessage
            text={
               "Aquí van a aparecer tus chats grupales. \n\nCuando se gustan varias personas entre sí formando un grupo se habilita un chat grupal."
            }
         />
      );
   }

   return (
      <>
         {slotsStatusInfoText != null && <HelpBanner text={slotsStatusInfoText} />}
         <BasicScreenContainer>
            <TitleText> Activas </TitleText>
            <List.Section>
               {groups.sort(firstBy(g => g.creationDate, "desc")).map(group => (
                  <List.Item
                     title={group.name}
                     left={props => (
                        <List.Icon
                           {...props}
                           icon={({ color: c }) => <GraphSvg2 circleColor={c} lineColor={c} />}
                        />
                     )}
                     onPress={() => navigate("Group", { groupId: group.groupId })}
                     key={group.groupId}
                  />
               ))}
            </List.Section>
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default GroupsListPage;
