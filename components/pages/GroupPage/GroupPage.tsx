import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Route } from "@react-navigation/native";
import { withTheme, List } from "react-native-paper";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import AvatarTouchable from "../../common/AvatarTouchable/AvatarTouchable";
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

export interface GroupPageProps extends Themed, StackScreenProps<{}> {}
export interface GroupPageState {
   expandedUser: number;
}

class GroupPage extends Component<GroupPageProps, GroupPageState> {
   state: GroupPageState = {
      expandedUser: -1
   };

   render(): JSX.Element {
      const { expandedUser }: Partial<GroupPageState> = this.state;
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;
      const { navigate }: StackNavigationProp<Record<string, {}>> = this.props.navigation;
      const route: Route<string, { group: Group }> = this.props.route as Route<
         string,
         { group: Group }
      >;
      const group: Group = route.params.group;

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
                     <BadgeExtended showAtLeftSide>3</BadgeExtended>
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
                           onPress={() =>
                              this.setState({ expandedUser: expandedUser !== i ? i : -1 })
                           }
                           titleStyle={styles.itemTitle}
                           left={props => (
                              <AvatarTouchable
                                 {...props}
                                 size={50}
                                 source={{ uri: user.images[0] }}
                              />
                           )}
                           key={i}
                        >
                           <List.Section
                              title="Se gusta con:"
                              style={styles.subItemTitle}
                              titleStyle={styles.sectionTitle}
                           >
                              {this.getMatchesOf(user.userId, group).map((matchedUser, u) => (
                                 <List.Item
                                    title={matchedUser.name}
                                    style={styles.subItem}
                                    key={u}
                                    onPress={() => navigate("Profile", { user: matchedUser })}
                                    left={props => (
                                       <AvatarTouchable
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
   }

   getMatchesOf(userId: string, group: Group): User[] {
      const matchesList: string[] = group.matches.find(m => m.userId === userId).matches;
      return group.members.filter(u => matchesList.includes(u.userId));
   }
}

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

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(GroupPage));
