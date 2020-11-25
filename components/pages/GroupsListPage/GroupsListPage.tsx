import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, List } from "react-native-paper";
import GraphSvg2 from "../../../assets/GraphSvg2";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import EmptyPageMessage from "../../common/EmptyPageMessage/EmptyPageMessage";

export interface GroupsListPageProps extends Themed, StackScreenProps<{}> {}
export interface GroupsListPageState {
   groups: Group[];
}

class GroupsListPage extends Component<GroupsListPageProps, GroupsListPageState> {
   state: GroupsListPageState = {
      groups: [] // Uncomment this line to test the "no groups" UI
      // TODO: Get groups from server
      // groups: getGroups()
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;
      const { navigate }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      const { groups }: Partial<GroupsListPageState> = this.state;

      if (groups.length === 0) {
         return (
            <EmptyPageMessage
               text={
                  "Acá van a aparecer tus citas grupales. Las citas se forman cuando se gustan varias personas formando un grupo."
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
                     title={group.members.map((user, u) => (u > 0 ? ", " : "") + user.name)}
                     description="Cita dentro de 2 días"
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
   }
}

const styles: Styles = StyleSheet.create({
   scene: {
      flex: 1
   }
});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(GroupsListPage));
