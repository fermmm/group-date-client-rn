import React, { Component } from "react";
import { View, Image, StyleProp, ViewStyle, ImageStyle, TouchableHighlight, ImageProps, ScrollView } from "react-native";

export interface ImagesScrollProps {
    images: string[];
    renderImage?: (image: string, imageProps: ImageProps) => JSX.Element;
    onImageClick?: (index: number) => void;
    style?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    imagesStyle?: StyleProp<ImageStyle>;
}

interface ImagesScrollState {
    imagesWidth: number;
    imagesHeight: number;
}

export default class ImagesScroll extends Component<ImagesScrollProps, ImagesScrollState> {
    state: ImagesScrollState = {
        imagesWidth: 0,
        imagesHeight: 0,
    };

    render(): JSX.Element {
        const { imagesWidth, imagesHeight }: Partial<ImagesScrollState> = this.state;
        const { images, style, imagesStyle, scrollViewStyle, onImageClick }: Partial<ImagesScrollProps> = this.props;

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
