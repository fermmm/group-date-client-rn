import React, { FC } from "react";
import { StyleSheet, Modal, TouchableOpacity, Image, ImageProps } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Gallery from "./Gallery/Gallery";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { prepareUrl } from "../../../api/tools/reactQueryTools";
import { useServerInfo } from "../../../api/server/server-info";

export interface ImagesModalProps {
   images: string[];
   visible: boolean;
   initialPage?: number;
   onClose?: () => void;
   renderImage?: (
      imageProps: ImageProps,
      dimensions: { width: number; height: number }
   ) => JSX.Element;
}

const ImagesModal: FC<ImagesModalProps> = props => {
   const imagesGalleryFormat = props.images.map(uri => ({
      source: { uri }
   }));

   return (
      <Modal
         transparent
         visible={props.visible}
         animationType={"fade"}
         onRequestClose={() => props.onClose && props.onClose()}
      >
         <Gallery
            style={styles.gallery}
            images={imagesGalleryFormat}
            initialPage={props.initialPage}
            imageComponent={(
               imageProps: ImageProps,
               dimensions: { width: number; height: number }
            ) =>
               props.renderImage == null ? (
                  <Image {...imageProps} />
               ) : (
                  props.renderImage(imageProps, dimensions)
               )
            }
         />
         <TouchableOpacity
            onPress={() => props.onClose && props.onClose()}
            style={styles.closeButton}
         >
            <Icon name={"close"} color={"white"} size={30} />
         </TouchableOpacity>
      </Modal>
   );
};

const styles: Styles = StyleSheet.create({
   gallery: {
      flex: 1,
      position: "absolute",
      backgroundColor: "black"
   },
   closeButton: {
      position: "absolute",
      opacity: 0.35,
      marginLeft: 10,
      marginTop: 10
   }
});

export default ImagesModal;
