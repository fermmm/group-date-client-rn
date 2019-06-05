import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";

export interface ICardsPageProps {

}

export interface ICardsPageState {
    
}

export default class CardsPage extends Component<ICardsPageProps, ICardsPageState> {
    render(): JSX.Element {
        return (
            <>
                <View style={[styles.scene, { backgroundColor: "white" }]} />
            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    example: {
        flex: 1,
    },
});
