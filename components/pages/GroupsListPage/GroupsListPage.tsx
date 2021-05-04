import React, { FC, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List } from "react-native-paper";
import GraphSvg2 from "../../../assets/GraphSvg2";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import EmptyPageMessage from "../../common/EmptyPageMessage/EmptyPageMessage";
import { sendSeenToGroup, useUserGroupList } from "../../../api/server/groups";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { useUser } from "../../../api/server/user";
import { firstBy } from "thenby";
import { useServerInfo } from "../../../api/server/server-info";
import { getSlotStatusInfoText } from "./tools/getSlotsInfoText";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import EmptySpace from "../../common/EmptySpace/EmptySpace";

const GroupsListPage: FC = () => {
   const { navigate } = useNavigation();
   const { data: groups } = useUserGroupList();
   const { data: user } = useUser();
   const { data: serverInfo } = useServerInfo();
   const slotsStatusInfoText = getSlotStatusInfoText(serverInfo, groups);
   const { token } = useAuthentication(user?.token);

   // Effect to show a notification when the group is not seen and send the seen request so it doesn't appear again
   useEffect(() => {
      if (groups == null || user == null || token == null) {
         return;
      }

      const notSeenGroup = groups.find(group => !group.seenBy.includes(user.userId));

      if (notSeenGroup != null) {
         Alert.alert(
            "Estas en un grupo",
            "¡¡Se formó un grupo y estás en el!!. Ve a la sección de grupos para verlo."
         );
         sendSeenToGroup({ token, userId: user.userId, groupId: notSeenGroup.groupId });
      }
   }, [groups, user, token]);

   if (groups == null || user == null || groups?.length === 0) {
      return (
         <EmptyPageMessage
            text={
               "Aquí van a aparecer tus citas grupales. Las citas se forman cuando se gustan varias personas formando un grupo."
            }
         />
      );
   }

   return (
      <BasicScreenContainer>
         {slotsStatusInfoText != null && (
            <>
               <HelpBanner text={slotsStatusInfoText} />
               <EmptySpace height={10} />
            </>
         )}
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
   );
};

const styles: Styles = StyleSheet.create({});

export default GroupsListPage;
