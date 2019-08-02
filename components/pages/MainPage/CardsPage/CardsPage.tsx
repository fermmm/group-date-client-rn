import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import ProfileCard from "../../../common/ProfileCard/ProfileCard";
import { withTheme } from "react-native-paper";
import { ThemeExt, Themed } from "../../../../common-tools/themes/types/Themed";

export interface CardsPageProps extends Themed { }
export interface CardsPageState { }

class CardsPage extends Component<CardsPageProps, CardsPageState> {
    images: string[] = [
        "https://i.postimg.cc/jdKQrj0X/61409457-172211943787907-7676116613910237160-n.jpg",
        "https://i.postimg.cc/jSSHLkjn/46051978-200921290817965-13954598237702697-n.jpg",
        "https://i.postimg.cc/j26HJpNP/40256728-466576210514467-4631245209299058688-n.jpg",
        "https://i.postimg.cc/J7jcgkg0/45851002-1832370293557567-4819309139041196322-n.jpg",
        "https://i.postimg.cc/Nj20J1JP/maluma.jpg",
    ];

    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
            // <ImageBackground source={this.props.theme.backgroundImage} style={{width: "100%", height: "100%"}}>
            <View style={[styles.mainContainer, { backgroundColor: colors.backgroundForText }]}>
                <ProfileCard 
                    images={this.images}
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
