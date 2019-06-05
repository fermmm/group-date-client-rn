import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { Card, Paragraph } from "react-native-paper";

export interface ICardsPageProps {

}

export interface ICardsPageState {

}

export default class CardsPage extends Component<ICardsPageProps, ICardsPageState> {
    render(): JSX.Element {
        return (
            <View style={styles.scene} >
                <Card>
                    <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
                    <Card.Title 
                        title="Alberto" 
                        subtitle="25 · Caballito" 
                    />
                    <Card.Content>
                        <Paragraph>Descripcion</Paragraph>
                    </Card.Content>
                </Card>
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    scene: {
        flex: 1,
        backgroundColor: "#FFC681",
        padding: 5,
    },
});
