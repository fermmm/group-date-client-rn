import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, List } from "react-native-paper";
import GraphSvg2 from "../../../assets/GraphSvg2";
import { ThemeExt, Themed } from "../../../common-tools/themes/types/Themed";
import { NavigationScreenProp, withNavigation, NavigationInjectedProps } from "react-navigation";
import { getGroups } from "../../../server-api/groups";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import { Group } from "../../../server-api/typings/Group";
import EmptyPageMessage from "../../common/EmptyPageMessage/EmptyPageMessage";

export interface GroupsListPageProps extends Themed, NavigationInjectedProps { }
export interface GroupsListPageState { 
   groups: Group[];
}

class GroupsListPage extends Component<GroupsListPageProps, GroupsListPageState> {
   state: GroupsListPageState = {
      // groups: []        // Uncomment this line to test the "no groups" UI
      groups: getGroups()
   };

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;
      const { groups }: Partial<GroupsListPageState> = this.state;

      if (groups.length === 0) {
         return <EmptyPageMessage text={"Acá van a aparecer tus citas grupales. Las citas se forman cuando se gustan varias personas formando un grupo."} />;
      } 

      return (
         <BasicScreenContainer>
            <TitleText extraMarginLeft extraSize>
               Tus citas grupales
            </TitleText>
            <List.Section>
               <List.Subheader>Invitaciones pendientes</List.Subheader>
               {
                  groups.map((group, i) =>
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
            <List.Section>
               <List.Subheader>Citas confirmadas</List.Subheader>
               {
                  groups.map((group, i) =>
                     group.invitationAccepted &&
                        <List.Item
                           title={group.members.map((user, u) => (u > 0 ? ", " : "") + user.name)}
                           description="Cita dentro de 2 días"
                           left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg2 circleColor={colors.accent2} lineColor={c} style={styles.logo} />} />}
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
