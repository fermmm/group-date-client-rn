import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { List } from "react-native-paper";
import GraphSvg2 from "../../../assets/GraphSvg2";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import EmptyPageMessage from "../../common/EmptyPageMessage/EmptyPageMessage";
import { useUserGroupList } from "../../../api/server/groups";
import { useNavigation } from "../../../common-tools/navigation/useNavigation";
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { useUser } from "../../../api/server/user";
import { getMatchesOf } from "../../../common-tools/groups/groups-tools";
import { firstBy } from "thenby";
import { useServerInfo } from "../../../api/server/server-info";
import { getSlotStatusInfoText } from "./tools/getSlotsInfoText";

const GroupsListPage: FC = () => {
   const { navigate } = useNavigation();
   const { data: groups } = useUserGroupList();
   const { data: user } = useUser();
   const { data: serverInfo } = useServerInfo();
   const slotsStatusInfoText = getSlotStatusInfoText(serverInfo, groups);

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
         {slotsStatusInfoText != null && <HelpBanner text={slotsStatusInfoText} />}
         <TitleText> Activas </TitleText>
         <List.Section>
            {groups.sort(firstBy(g => g.creationDate, "desc")).map(group => (
               <List.Item
                  title={group.members.map(
                     (user, i) =>
                        (i > 0 ? (i === group.members.length - 1 ? " y " : ", ") : "") +
                        toFirstUpperCase(user.name)
                  )}
                  description={`Te gustas con ${getMatchesOf(user.userId, group).length} personas`}
                  left={props => (
                     <List.Icon
                        {...props}
                        icon={({ color: c }) => (
                           <GraphSvg2 circleColor={c} lineColor={c} style={styles.logo} />
                        )}
                     />
                  )}
                  onPress={() => navigate("Group", { group })}
                  key={group.groupId}
               />
            ))}
         </List.Section>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   scene: {
      flex: 1
   }
});

export default GroupsListPage;
