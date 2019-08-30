import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, List } from "react-native-paper";
import { NavigationContainerProps, NavigationScreenProp, ScrollView } from "react-navigation";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import AvatarTouchable from "../../common/AvatarTouchable/AvatarTouchable";
import { Group } from "../../../server-api/typings/Group";
import { User } from "../../../server-api/typings/User";

export interface GroupPageProps extends Themed, NavigationContainerProps { }
export interface GroupPageState { }

class GroupPage extends Component<GroupPageProps, GroupPageState> {
    static defaultProps: Partial<GroupPageProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        const { getParam }: NavigationScreenProp<{}> = this.props.navigation;
        const group: Group = getParam("group");
        
        return (
            <>
                <AppBarHeader />
                <ScrollView>
                    <List.Section title="Miembros del grupo">
                    {
                        group.users.map((user, i) => 
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
                                    this.convertIdListInUsersList(group.matches[user.id], group.users).map((matchedUser, u) => 
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
    },
    subItemTitle: {
        paddingLeft: 10,
    },
    subItem: {
        paddingLeft: 36,
    },
});

export default withTheme(GroupPage);
