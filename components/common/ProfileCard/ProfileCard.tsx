import React, { Component } from "react";
import color from "color";
import { ImageProps, Image, StatusBar, StyleSheet, ImageBackground, View } from "react-native";
import { Card, Paragraph, withTheme } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { IThemed, ITheme } from "../../../common-tools/ts-tools/Themed";
import LikeDislikeButtons from "./LikeDislikeButtons/LikeDislikeButtons";
import ScrollViewExtended from "../ScrollViewExtended/ScrollViewExtended";

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
            <View style={[styles.mainContainer, { paddingBottom: showLikeDislikeButtons ? styles.mainContainer.paddingBottom : 0 }]}>
                <View>
                    <ScrollViewExtended style={[styles.scrollView]} showBottomGradient={true} bottomGradientColor={colors.background2}>
                        <Card style={[styles.card, { backgroundColor: colors.background2 }]}>
                            <ImageBackground source={backgroundImage} style={styles.galleryBackground}>
                                <ImagesScroll
                                    images={images}
                                    style={styles.galleryScroll}
                                    imagesStyle={{ backgroundColor: color("black").alpha(0.25).string() }}
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
                                titleStyle={{ color: colors.text2 }}
                                subtitleStyle={{ color: colors.text2 }}
                            />
                            <Card.Content>
                                <Paragraph style={{ color: colors.text2 }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </ScrollViewExtended>
                    {
                        showLikeDislikeButtons &&
                        <LikeDislikeButtons
                            style={styles.likeDislikeButtons}
                            onLikeClick={() => console.log("Like clicked")}
                            onDislikeClick={() => console.log("Dislike clicked")}
                        />
                    }
                </View>
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
        paddingBottom: 35,          // The bottom padding under the like-dislike buttons (only applied when buttons are present). 
    },
    scrollView: {
        flexGrow: 0,
    },
    card: {
        paddingBottom: 30,          // Bottom padding to prevent like-dislike buttons from covering text when scrolled all the way down. (Only applied if the like-dislike buttons are visible).
    },
    galleryScroll: {
        height: 350,                // This controls the height of the images area.
    },
    galleryBackground: {
        width: "100%",
        height: "auto",
    },
    likeDislikeButtons: {
        alignSelf: "center",        // This controls the horizontal position of the buttons.
        bottom: -28,                // This controls the vertical position of the buttons.
    },
});

export default withTheme(ProfileCard);
