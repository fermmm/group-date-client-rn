import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Surface, Text, ProgressBar, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface VotingPollProps extends Themed {}
export interface VotingPollState {}

class VotingPoll extends Component<VotingPollProps, VotingPollState> {
    static defaultProps: Partial<VotingPollProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        
        return (
            <Surface style={styles.surface}>
                <Text>Surface</Text>
                <ProgressBar progress={0.5} color={colors.accent} />
                <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
                    Press me
                </Button>
            </Surface>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default withTheme(VotingPoll);
