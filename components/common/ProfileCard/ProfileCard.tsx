import React, { Component } from "react";
import { ImageProps, Image, StatusBar } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";
import ImagesModal from "../ImagesModal/ImagesModal";

export interface IProfileCardProps {
    images: string[];
}

export interface IProfileCardState {
    renderImageModal: boolean;
    imageSelected: number;
}

export default class ProfileCard extends Component<IProfileCardProps, IProfileCardState> {
    state: IProfileCardState = {
        renderImageModal: false,
        imageSelected: 0,
    };

    render(): JSX.Element {
        const { images }: Partial<IProfileCardProps> = this.props;
        const { renderImageModal, imageSelected }: Partial<IProfileCardState> = this.state;
        StatusBar.setHidden(renderImageModal, "slide");
        return (
            <Card>
                <ImagesScroll
                    images={images}
                    style={{ height: 250 }}
                    onImageClick={(i: number) => this.setState({ imageSelected: i, renderImageModal: true })}
                    renderImage={(image: string, imageProps: ImageProps) =>
                        <Image {...imageProps} key={image} />
                    }
                />
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
                    title="Malumaa"
                    subtitle="25 · Caballito"
                />
                <Card.Content>
                    <Paragraph>Descripcion</Paragraph>
                </Card.Content>
            </Card>
        );
    }
}
