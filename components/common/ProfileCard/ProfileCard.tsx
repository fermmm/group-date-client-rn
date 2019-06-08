import React, { Component } from "react";
import color from "color";
import { ImageProps, Image, StatusBar, StyleSheet, ImageBackground, ImageStyle } from "react-native";
import { Card, Paragraph, withTheme, Theme } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { IThemed, ITheme } from "../../../common-tools/ts-tools/Themed";

export interface IProfileCardProps extends IThemed {
    images: string[];
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
        const { images }: Partial<IProfileCardProps> = this.props;
        const { renderImageModal, imageSelected }: Partial<IProfileCardState> = this.state;
        const { colors, backgroundImage }: ITheme = this.props.theme;

        StatusBar.setHidden(renderImageModal, "slide");
        return (
            <Card style={{ backgroundColor: color("black").alpha(0.3) } as unknown}>
                <ImageBackground source={backgroundImage} style={{ width: "100%", height: 300 }}>
                    <ImagesScroll
                        images={images}
                        style={{ height: 300 }}
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
                />
                <Card.Content>
                    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </Paragraph>
                </Card.Content>
            </Card>
        );
    }
}

const styles: Styles = StyleSheet.create({
    smallImage: {
        backgroundColor: "black",
    },
});

export default withTheme(ProfileCard);