import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../SurfaceStyled/SurfaceStyled";
import { currentTheme } from "../../../config";
import ProgressBar from "../ProgressBar/ProgressBar";

export interface VotingPollProps extends Themed {}
export interface VotingPollState {}

class VotingPoll extends Component<VotingPollProps, VotingPollState> {
    static defaultProps: Partial<VotingPollProps> = {};

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;
        
        return (
            <SurfaceStyled>
                <Text style={styles.optionNameText}>
                    Mate + porro en Parque Centenario
                </Text>
                <Text style={styles.optionAddressText}>
                    Dirección: Av. Angel Gallardo 400
                </Text>
                <View style={styles.rowContainer}>
                    <ProgressBar progress={0.75} fillColor={colors.primary}/>
                    <Button compact onPress={() => console.log('Pressed')} uppercase={false} icon={"add"}>
                        Votar
                    </Button>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.votesAmmountText}>3 la votaron: </Text>
                    <Text style={styles.votersText}>johnny, maluma, alberto666</Text>
                </View>
            </SurfaceStyled>
        );
    }
}

const styles: Styles = StyleSheet.create({
    optionNameText: {
        fontFamily: currentTheme.fonts.regular,
        fontSize: 15,
        marginBottom: 5,
    },
    optionAddressText: {
        fontFamily: currentTheme.fonts.light,
        fontSize: 12,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    resultBar: {
        flex: 1,
    },
    votesAmmountText: {
        fontFamily: currentTheme.fonts.regular,
        fontSize: 12,
    },
    votersText: {
        fontFamily: currentTheme.fonts.thin,
        fontSize: 12,
    },
});

export default withTheme(VotingPoll);
