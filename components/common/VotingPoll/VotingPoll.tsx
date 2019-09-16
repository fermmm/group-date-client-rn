import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Surface, Text, ProgressBar, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { white } from "color-name";
import SurfaceStyled from "../SurfaceStyled/SurfaceStyled";

export interface VotingPollProps extends Themed {}
export interface VotingPollState {}

class VotingPoll extends Component<VotingPollProps, VotingPollState> {
    static defaultProps: Partial<VotingPollProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        
        return (
            <SurfaceStyled>
                <Text>Parque Centenario</Text>
                <ProgressBar progress={0.5} color={colors.accent} />
                <Button icon="add" onPress={() => console.log('Pressed')} >
                    Votar
                </Button>
            </SurfaceStyled>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default withTheme(VotingPoll);
