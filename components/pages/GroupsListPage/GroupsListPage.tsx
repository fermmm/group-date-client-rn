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

const GroupsListPage: FC = () => {
   const { data: groups } = useUserGroupList();
   const { navigate } = useNavigation();

   if (groups == null || groups?.length === 0) {
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
         <TitleText extraMarginLeft extraSize>
            Tus citas grupales
         </TitleText>
         <List.Section>
            {groups.map((group, i) => (
               <List.Item
                  title={group.members.map(
                     (user, u) => (u > 0 ? ", " : "") + toFirstUpperCase(user.name)
                  )}
                  description={`Cita de ${group.members.length} personas`}
                  left={props => (
                     <List.Icon
                        {...props}
                        icon={({ color: c }) => (
                           <GraphSvg2 circleColor={c} lineColor={c} style={styles.logo} />
                        )}
                     />
                  )}
                  onPress={() => navigate("Group", { group })}
                  key={i}
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
