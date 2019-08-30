import React, { Component } from "react";
import { StyleSheet, Modal, TouchableOpacity, Image, ImageProps } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Gallery from "./Gallery/Gallery";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface ImagesModalProps {
    photos: string[];
    visible: boolean;
    initialPage?: number;
    onClose?: () => void;
    renderImage?: (imageProps: ImageProps, dimentions: {width: number, height: number}) => JSX.Element;
}

export default class ImagesModal extends Component<ImagesModalProps> {
    render(): JSX.Element {
        const imagesGalleryFormat: ImageData = this.props.photos.map((uri: string, i: number) => ({source: {uri}}));
        return (
            <Modal
                visible={this.props.visible}
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => this.props.onClose && this.props.onClose()}
            >
                <Gallery
                    style={styles.gallery}
                    images={imagesGalleryFormat}
                    initialPage={this.props.initialPage}
                    imageComponent={(imageProps: ImageProps, dimentions: {width: number, height: number}) =>
                        this.props.renderImage == null ? <Image {...imageProps} /> : this.props.renderImage(imageProps, dimentions)
                    }
                />
                <TouchableOpacity
                    onPress={() => this.props.onClose && this.props.onClose()}
                    style={styles.closeButton}
                >
                    <Icon
                        name={"close"}
                        color={"white"}
                        size={30}
                    />
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles: Styles = StyleSheet.create({
    gallery: {
        flex: 1, 
        position: "absolute", 
        backgroundColor: "black",
    },
    closeButton: { 
        position: "absolute", 
        opacity: 0.35, 
        marginLeft: 10, 
        marginTop: 10,
    },
});

type ImageData = Array<{ source: { uri: string } }>;
