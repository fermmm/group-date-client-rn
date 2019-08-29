import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../../common/ProfileCard/ProfileCard";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../../common-tools/themes/types/Themed";
import { getAvaiableCards } from "../../../../server-api/cards-game";

export interface CardsPageProps extends Themed { }
export interface CardsPageState { }

class CardsPage extends Component<CardsPageProps, CardsPageState> {
    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            // <ImageBackground source={this.props.theme.backgroundImage} style={{width: "100%", height: "100%"}}>
            <View style={[styles.mainContainer, { backgroundColor: colors.backgroundForText }]}>
                <ProfileCard 
                    user={getAvaiableCards()[0]}
                    showLikeDislikeButtons={true} 
                    onLikeClick={() => console.log("Like clicked")}
                    onDislikeClick={() => console.log("Dislike clicked")}
                />
            </View>
            // </ImageBackground>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 0,
    },
});

export default withTheme(CardsPage);
