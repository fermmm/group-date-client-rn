import React, { Component } from "react";
import { View, Image, StyleProp, ViewStyle, ImageStyle, TouchableHighlight, ImageProps, ScrollView } from "react-native";

export interface IImagesScrollProps {
    images: string[];
    renderImage?: (image: string, imageProps: ImageProps) => JSX.Element;
    onImageClick?: (index: number) => void;
    style?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    imagesStyle?: StyleProp<ImageStyle>;
}

interface IImagesScrollState {
    imagesWidth: number;
    imagesHeight: number;
}

export default class ImagesScroll extends Component<IImagesScrollProps, IImagesScrollState> {
    state: IImagesScrollState = {
        imagesWidth: 0,
        imagesHeight: 0,
    };

    render(): JSX.Element {
        const { imagesWidth, imagesHeight }: Partial<IImagesScrollState> = this.state;
        const { images, style, imagesStyle, scrollViewStyle, onImageClick }: Partial<IImagesScrollProps> = this.props;

        return (
            <View style={[{ height: 200 }, style]} onLayout={e => this.setState({ imagesWidth: e.nativeEvent.layout.width, imagesHeight: e.nativeEvent.layout.height })}>
                <ScrollView style={[scrollViewStyle]} horizontal={true} pagingEnabled={true} indicatorStyle={"white"}>
                    {
                        images.map((value: string, i: number) =>
                            !onImageClick
                                ?
                                    this.renderImage(value, {
                                        style: [{ width: imagesWidth, height: imagesHeight }, imagesStyle],
                                        source: { uri: value },
                                    })
                                :
                                    <TouchableHighlight onPress={() => onImageClick && onImageClick(i)} key={i}>
                                        {
                                            this.renderImage(value, {
                                                style: [{ width: imagesWidth, height: imagesHeight }, imagesStyle],
                                                source: { uri: value },
                                            })
                                        }
                                    </TouchableHighlight>,
                        )
                    }
                </ScrollView>
            </View>
        );
    }

    renderImage(image: string, imageProps: ImageProps): JSX.Element {
        return this.props.renderImage ?
                this.props.renderImage(image, imageProps)
            :
                <Image {...imageProps} key={image}/>;
    }
}
