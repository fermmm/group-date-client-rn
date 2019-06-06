import React, { Component } from "react";
import { ImageProps, Image } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import ImagesScroll from "../ImagesScroll/ImagesScroll";

export interface IProfileCardProps {
    images: string[];
}

export default class ProfileCard extends Component<IProfileCardProps> {
    render(): JSX.Element {
        const { images }: Partial<IProfileCardProps> = this.props;

        return (
            <Card>
                <ImagesScroll
                    images={images}
                    style={{ height: 250 }}
                    renderImage={(image: string, imageProps: ImageProps) =>
                        <Image {...imageProps} key={image} />
                    }
                />
                <Card.Title
                    title="Alberto"
                    subtitle="25 · Caballito"
                />
                <Card.Content>
                    <Paragraph>Descripcion</Paragraph>
                </Card.Content>
            </Card>
        );
    }
}