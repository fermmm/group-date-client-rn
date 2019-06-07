import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../../common/ProfileCard/ProfileCard";

export interface ICardsPageProps { }

export interface ICardsPageState { }

export default class CardsPage extends Component<ICardsPageProps, ICardsPageState> {
    images: string[] = [
        "https://source.unsplash.com/1024x768/?nature",
        "https://source.unsplash.com/1024x768/?water",
        "https://source.unsplash.com/1024x768/?girl",
        "https://source.unsplash.com/1024x768/?tree",
    ];

    render(): JSX.Element {
        return (
            <>
                <View style={styles.scene}>
                    <ProfileCard images={this.images} />
                </View>
            </>
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
