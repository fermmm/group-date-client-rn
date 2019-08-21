import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, List } from "react-native-paper";
import { NavigationContainerProps } from "react-navigation";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";

export interface GroupPageProps extends Themed, NavigationContainerProps { }
export interface GroupPageState { }

class GroupPage extends Component<GroupPageProps, GroupPageState> {
    static defaultProps: Partial<GroupPageProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            <>
                <AppBarHeader />
                <List.Section title="Accordions">
                    <List.Accordion
                        title="Uncontrolled Accordion"
                        left={props => <List.Icon {...props} icon="folder" />}
                    >
                        <List.Item title="First item" />
                        <List.Item title="Second item" />
                    </List.Accordion>

                    <List.Accordion
                        title="Controlled Accordion"
                        left={props => <List.Icon {...props} icon="folder" />}
                    >
                        <List.Item title="First item" />
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
});

export default withTheme(GroupPage);
