import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../../common/ProfileCard/ProfileCard";
import { IThemed } from "../../../../common-tools/ts-tools/Themed";
import { withTheme } from "react-native-paper";
import { Theme } from "react-native-paper/typings";

export interface ICardsPageProps extends IThemed {}
export interface ICardsPageState { }

class CardsPage extends Component<ICardsPageProps, ICardsPageState> {
    images: string[] = [
        "https://source.unsplash.com/1024x768/?nature",
        "https://source.unsplash.com/1024x768/?water",
        "https://source.unsplash.com/1024x768/?girl",
        "https://source.unsplash.com/1024x768/?tree",
    ];

    render(): JSX.Element {
        const { colors }: Theme = this.props.theme;

        return (
            <View style={[styles.scene, {backgroundColor: colors.background}]}>
                <ProfileCard images={this.images} />
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    scene: {
        flex: 1,
        padding: 5,
    },
});

export default withTheme(CardsPage);
