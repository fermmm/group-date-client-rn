import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, List } from "react-native-paper";
import { NavigationContainerProps, NavigationScreenProp } from "react-navigation";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import AvatarTouchable from "../../common/AvatarTouchable/AvatarTouchable";
import { Group } from "../../../server-api/typings/Group";
import { User } from "../../../server-api/typings/User";
import SurfaceStyled from "../../common/SurfaceStyled/SurfaceStyled";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import { currentTheme } from "../../../config";
import CardDateInfo from "./CardDateInfo/CardDateInfo";
import ButtonForAppBar from "../../common/ButtonForAppBar/ButtonForAppBar";
import CardAcceptInvitation from "./CardAcceptInvitation/CardAcceptInvitation";

export interface GroupPageProps extends Themed, NavigationContainerProps { }
export interface GroupPageState {
   expandedUser: number;
 }

class GroupPage extends Component<GroupPageProps, GroupPageState> {
   state: GroupPageState = {
      expandedUser: -1
   };

   render(): JSX.Element {
      const { expandedUser }: Partial<GroupPageState> = this.state;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { getParam, navigate }: NavigationScreenProp<{}> = this.props.navigation;
      const group: Group = getParam("group");

      return (
         <>
            <AppBarHeader title={group.invitationAccepted ? "Grupo" : "Invitación a una cita"}>
               {
                  group.invitationAccepted &&
                     <ButtonForAppBar 
                        icon="chat-bubble-outline"
                        onPress={() => console.log("Pressed")}
                     >
                        Chat
                     </ButtonForAppBar>
               }
            </AppBarHeader>
            <BasicScreenContainer>   
               {
                  !group.invitationAccepted &&
                     <CardAcceptInvitation 
                        matchAmmount={3}
                        onAcceptPress={() => navigate("Voting", { group })}
                     />
               }
               {
                  group.invitationAccepted &&
                     <CardDateInfo 
                        onModifyVotePress={() => navigate("Voting", { group })}
                     />
               }
               <SurfaceStyled>
                  <TitleText>
                     Miembros del grupo:
                  </TitleText>
                  <List.Section>
                     {
                        group.members.map((user, i) =>
                           <List.Accordion
                              title={user.name}
                              expanded={i === expandedUser}
                              onPress={() => this.setState({expandedUser: expandedUser !== i ? i : -1})}
                              titleStyle={styles.itemTitle}
                              left={props =>
                                 <AvatarTouchable
                                    {...props}
                                    size={50}
                                    source={{ uri: user.photos[0] }}
                                 />
                              }
                              key={i}
                           >
                              <List.Section title="Se gusta con:" style={styles.subItemTitle} titleStyle={styles.sectionTitle}>
                                 {
                                    this.convertIdListInUsersList(group.matches[user.id], group.members).map((matchedUser, u) =>
                                       <List.Item
                                          title={matchedUser.name}
                                          style={styles.subItem}
                                          key={u}
                                          onPress={() => navigate("Profile", { user: matchedUser })}
                                          left={props =>
                                             <AvatarTouchable
                                                {...props}
                                                onPress={() => navigate("Profile", { user: matchedUser })}
                                                size={50}
                                                source={{ uri: matchedUser.photos[0] }}
                                             />
                                          }
                                       />,
                                    )
                                 }
                              </List.Section>
                           </List.Accordion>,
                        )
                     }
                  </List.Section>
               </SurfaceStyled>
            </BasicScreenContainer>
         </>
      );
   }

   convertIdListInUsersList(idList: string[], allUsersList: User[]): User[] {
      const result: User[] = [];

      for (const user of allUsersList) {
         if (idList.indexOf(user.id) !== -1) {
            result.push(user);
         }
      }

      return result;
   }
}

const styles: Styles = StyleSheet.create({
   itemTitle: {
      textAlign: "center"
   },
   subItemTitle: {
      paddingLeft: 10,
   },
   sectionTitle: {
      fontFamily: currentTheme.fonts.regular,
      fontSize: 15
   },
   subItem: {
      paddingLeft: 26,
   }
});

export default withTheme(GroupPage);
