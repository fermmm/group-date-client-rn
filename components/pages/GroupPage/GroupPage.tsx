import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, List, Button, Text } from "react-native-paper";
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
import TitleMediumText from "../../common/TitleMediumText/TitleMediumText";
import { currentTheme } from "../../../config";

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
                     <Button 
                        icon="chat-bubble-outline" 
                        mode="outlined"
                        uppercase={false}
                        style={styles.buttonChat}
                        color={colors.text2}
                        onPress={() => console.log('Pressed')}
                     >
                        Chat 
                     </Button>
               }
            </AppBarHeader>
            <BasicScreenContainer>   
               {
                  !group.invitationAccepted &&
                     <SurfaceStyled>
                        <TitleMediumText>
                           ¡Felicitaciones! te gustas con 3 miembros de este grupo, en el próximo paso vamos organizar una cita grupal entre todes.
                        </TitleMediumText>
                        <TitleMediumText>
                           Mas abajo podes explorar a los demas miembros del grupo y ver quienes se gustan con quienes.
                        </TitleMediumText>
                        <TitleMediumText>
                           Si realmente tenés las ganas y pensas que podes ir a una cita presiona el boton de continuar.
                        </TitleMediumText>
                        <Button
                           mode="outlined"
                           uppercase={false}
                           style={[styles.button, { borderColor: colors.primary }]}
                           contentStyle={styles.buttonContent}
                           onPress={() => navigate("Voting", { group })}
                        >
                           Quiero una cita, ¡continuar!
                        </Button>
                     </SurfaceStyled>
               }
               {
                  group.invitationAccepted &&
                     <SurfaceStyled>
                        <TitleText>
                           Datos de la cita:
                        </TitleText>
                        <Text style={styles.votingResulttextLine1}>
                           Lugar: Mate + porro en Parque Centenario
                        </Text>
                        <Text style={styles.votingResulttextLine2}>
                           Dirección: Av. Angel Gallardo 400
                        </Text>
                        <Text style={styles.votingResulttextLine2}>
                           Fecha: Este Sábado 20 de Septiembre a las 21
                        </Text>
                        <Button
                           uppercase={false}
                           onPress={() => console.log("Pressed")}
                        >
                           Modificar voto
                        </Button>
                     </SurfaceStyled>
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
                                 onPress={() => console.log("AVATAR PRESS")}
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
                                          left={props =>
                                             <AvatarTouchable
                                                {...props}
                                                onPress={() => console.log("AVATAR PRESS")}
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
   },
   button: {
      width: "100%",
      marginBottom: 15
   },
   buttonContent: {
      width: "100%",
      height: 45,
   },
   buttonChat: {
      borderColor: currentTheme.colors.text2
   },
   votingResulttextLine1: {
      fontFamily: currentTheme.fonts.regular,
      fontSize: 15,
      marginBottom: 5,
   },
   votingResulttextLine2: {
      fontFamily: currentTheme.fonts.light,
      fontSize: 12,
   },
   votesAmmountText: {
      fontFamily: currentTheme.fonts.regular,
      fontSize: 12,
      marginRight: 7,
   },
   votersText: {
      flex: 1,
      fontFamily: currentTheme.fonts.thin,
      fontSize: 12,
   },
});

export default withTheme(GroupPage);
