import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, List } from "react-native-paper";
import { NavigationContainerProps, NavigationScreenProp } from "react-navigation";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import AvatarTouchable from "../../common/AvatarTouchable/AvatarTouchable";
import { Group } from "../../../server-api/typings/Group";

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
                <List.Section title="Accordions">
                    <List.Accordion
                        title="Uncontrolled Accordion"
                        left={props =>
                            <AvatarTouchable
                                {...props}
                                onPress={() => console.log("AVATAR PRESS")}
                                size={40}
                                source={{ uri: "https://i.postimg.cc/jdKQrj0X/61409457-172211943787907-7676116613910237160-n.jpg" }}
                            />
                        }
                    >
                        <List.Item
                            title="First item"
                            left={props =>
                                <AvatarTouchable
                                    {...props}
                                    onPress={() => console.log("AVATAR PRESS")}
                                    size={40}
                                    source={{ uri: "https://i.postimg.cc/jSSHLkjn/46051978-200921290817965-13954598237702697-n.jpg" }}
                                />
                            }
                            style={styles.subItem}
                        />
                        <List.Item title="Second item" />
                    </List.Accordion>
                </List.Section>
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    subItem: {
        paddingLeft: 40,
    },
});

export default withTheme(GroupPage);
