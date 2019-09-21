import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, List, Button, Text } from "react-native-paper";
import { NavigationContainerProps, NavigationScreenProp, ScrollView } from "react-navigation";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import AvatarTouchable from "../../common/AvatarTouchable/AvatarTouchable";
import { Group } from "../../../server-api/typings/Group";
import { User } from "../../../server-api/typings/User";
import VotingPoll from "../../common/VotingPoll/VotingPoll";
import { testingVotingData } from "../../../server-api/testingFakeData";
import SurfaceStyled from "../../common/SurfaceStyled/SurfaceStyled";

export interface GroupPageProps extends Themed, NavigationContainerProps { }
export interface GroupPageState {}

class GroupPage extends Component<GroupPageProps, GroupPageState> {
    state: GroupPageState = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        const { getParam }: NavigationScreenProp<{}> = this.props.navigation;
        const group: Group = getParam("group");
        
        return (
            <>
            <AppBarHeader />
            <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollViewContainer}>
                {
                    !group.invitationAccepted &&
                        <View>
                            <Text style={styles.textBlock}>
                                ¡Felicitaciones! te gustas con 3 miembros de este grupo, en el proximo paso vamos organizar una cita grupal entre todes.
                            </Text>
                            <Text style={styles.textBlock}>
                                Mas abajo podes explorar a los demas miembros del grupo.
                            </Text>
                            <Text style={styles.textBlock}>
                                Si realmente tenés las ganas y podes ir a una cita presiona el boton de continuar.
                            </Text>
                            <Button mode="outlined" uppercase={false} style={[styles.button, {borderColor: colors.primary}]} contentStyle={styles.buttonContent} onPress={() => console.log("continue press")}>
                                Quiero una cita, ¡continuar!
                            </Button>
                        </View>
                }
                <SurfaceStyled>
                    <List.Section title="Miembros del grupo">
                    {
                        group.members.map((user, i) => 
                            <List.Accordion
                                title={user.name}
                                key={i}
                                left={props =>
                                    <AvatarTouchable
                                        {...props}
                                        onPress={() => console.log("AVATAR PRESS")}
                                        size={50}
                                        source={{ uri: user.photos[0] }}
                                    />
                                }
                            >
                                <List.Section title="Se gusta con:" style={styles.subItemTitle}>
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
                <VotingPoll 
                    group={group}
                    votingOptions={testingVotingData}
                />
            </ScrollView>
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
    mainContainer: {
        flex: 1,
        padding: 10,
        paddingBottom: 60,
    },
    subItemTitle: {
        paddingLeft: 10,
    },
    subItem: {
        paddingLeft: 36,
    },
    textBlock: {
        marginBottom: 15,
        textAlign: "center",
    },
    button: {
        width: "100%",
        marginBottom: 15,
        borderRadius: 25,
    },
    buttonContent: {
        width: "100%",
        height: 45,
    },
    scrollViewContainer: {
        paddingTop: 5,
        paddingBottom: 60,
    },
});

export default withTheme(GroupPage);
