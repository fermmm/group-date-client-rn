import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, List } from "react-native-paper";
import GraphSvg2 from "../../../assets/GraphSvg2";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { NavigationScreenProp, withNavigation, NavigationInjectedProps } from "react-navigation";
import { getGroups } from "../../../server-api/groups";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";

export interface GroupsListPageProps extends Themed, NavigationInjectedProps { }
export interface GroupsListPageState { }

class GroupsListPage extends Component<GroupsListPageProps, GroupsListPageState> {

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;

      return (
         <BasicScreenContainer>
            <List.Section>
               <List.Subheader>Citas confirmadas</List.Subheader>
               {
                  getGroups().map((group, i) =>
                     group.invitationAccepted &&
                     <List.Item
                        title={group.members.map((user, u) => (u > 0 ? ", " : "") + user.name)}
                        description="Cita dentro de 2 días"
                        left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg2 circleColor={colors.primary} lineColor={c} style={styles.logo} />} />}
                        onPress={() => navigate("Group", { group })}
                        key={i}
                     />,
                  )
               }
            </List.Section>
            <List.Section>
               <List.Subheader>Invitaciones pendientes</List.Subheader>
               {
                  getGroups().map((group, i) =>
                     !group.invitationAccepted &&
                     <List.Item
                        title={group.members.map((user, u) => (u > 0 ? ", " : "") + user.name)}
                        description="En espera de que aceptes invitacion"
                        left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg2 circleColor={c} lineColor={c} style={styles.logo} />} />}
                        onPress={() => navigate("Group", { group })}
                        key={i}
                     />,
                  )
               }
            </List.Section>
         </BasicScreenContainer>
      );
   }
}

const styles: Styles = StyleSheet.create({
   scene: {
      flex: 1,
   },
});

export default withNavigation(withTheme(GroupsListPage));
