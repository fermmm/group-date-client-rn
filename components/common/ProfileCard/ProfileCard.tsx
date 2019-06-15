import React, { Component } from "react";
import color from "color";
import { ImageProps, Image, StatusBar, StyleSheet, ImageBackground, ScrollView, View } from "react-native";
import { Card, Paragraph, withTheme } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { IThemed, ITheme } from "../../../common-tools/ts-tools/Themed";
import LikeDislikeButtons from "./LikeDislikeButtons/LikeDislikeButtons";

export interface IProfileCardProps extends IThemed {
    images: string[];
    showLikeDislikeButtons?: boolean;
}

export interface IProfileCardState {
    renderImageModal: boolean;
    imageSelected: number;
}

class ProfileCard extends Component<IProfileCardProps, IProfileCardState> {
    state: IProfileCardState = {
        renderImageModal: false,
        imageSelected: 0,
    };

    render(): JSX.Element {
        const { images, showLikeDislikeButtons }: Partial<IProfileCardProps> = this.props;
        const { renderImageModal, imageSelected }: Partial<IProfileCardState> = this.state;
        const { colors, backgroundImage }: ITheme = this.props.theme;

        StatusBar.setHidden(renderImageModal, "slide");
        return (
            <View style={[styles.mainContainer, {paddingBottom: showLikeDislikeButtons ? 35 : 0}]}>
                <ScrollView style={styles.scrollViewStyle}>
                    <Card style={[styles.card , {backgroundColor: colors.background2 }]}>
                        <ImageBackground source={backgroundImage} style={styles.galleryBackground}>
                            <ImagesScroll
                                images={images}
                                style={styles.galleryScroll}
                                imagesStyle={{ backgroundColor: color("black").alpha(0.25) } as unknown}
                                onImageClick={(i: number) => this.setState({ imageSelected: i, renderImageModal: true })}
                                renderImage={(image: string, imageProps: ImageProps) =>
                                    <Image
                                        {...imageProps}
                                        resizeMethod={"resize"}
                                        resizeMode={"contain"}
                                        key={image}
                                    />
                                }
                            />
                        </ImageBackground>
                        {
                            renderImageModal === true &&
                                <ImagesModal
                                    visible={renderImageModal}
                                    images={images}
                                    initialPage={imageSelected}
                                    onClose={() => this.setState({ renderImageModal: false })}
                                />
                        }
                        <Card.Title
                            title="martukrasinsky"
                            subtitle="28 · Caballito"
                            titleStyle={{ color: colors.text2 } as unknown}
                            subtitleStyle={{ color: colors.text2 } as unknown}
                        />
                        <Card.Content>
                            <Paragraph style={{ color: colors.text2 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </Paragraph>
                        </Card.Content>
                    </Card>
                </ScrollView>
                {
                    showLikeDislikeButtons && 
                        <LikeDislikeButtons 
                            onLikeClick={() => console.log("Like clicked")}
                            onDislikeClick={() => console.log("Dislike clicked")}
                        />
                }
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: { 
        height: "auto", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
    },
    scrollView: { 
        height: "auto",
    },
    card: {
        paddingBottom: 16,
    },
    galleryScroll: { 
        height: 350,
    },
    galleryBackground: {
        width: "100%", 
        height: "auto", 
    },
});

export default withTheme(ProfileCard);