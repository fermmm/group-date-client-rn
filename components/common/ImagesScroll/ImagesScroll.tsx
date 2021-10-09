import React, { FC, useEffect, useState } from "react";
import {
   View,
   Image,
   StyleProp,
   ViewStyle,
   ImageStyle,
   ImageProps,
   ScrollView,
   NativeSyntheticEvent,
   NativeScrollEvent
} from "react-native";
import DotsIndicator from "../DotsIndicator/DotsIndicator";
import { Asset } from "expo-asset";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";

export interface PropsImagesScroll {
   images: string[];
   renderImage?: (image: string, imageProps: ImageProps) => JSX.Element;
   onImageClick?: (index: number) => void;
   style?: StyleProp<ViewStyle>;
   scrollViewStyle?: StyleProp<ViewStyle>;
   imagesStyle?: StyleProp<ImageStyle>;
   showDots?: boolean;
}

const ImagesScroll: FC<PropsImagesScroll> = props => {
   const {
      showDots = true,
      images,
      style,
      imagesStyle,
      scrollViewStyle,
      renderImage,
      onImageClick
   } = props;
   const [imagesWidth, setImagesWidth] = useState(0);
   const [imagesHeight, setImagesHeight] = useState(0);
   const [currentPictureFocused, setCurrentPictureFocused] = useState(0);

   useEffect(() => {
      cacheImages();
   }, []);

   const findImageToRender = (image: string, imageProps: ImageProps): JSX.Element => {
      return renderImage ? renderImage(image, imageProps) : <Image {...imageProps} key={image} />;
   };

   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setCurrentPictureFocused(
         Math.round(
            Math.ceil(event.nativeEvent.contentOffset.x) / event.nativeEvent.layoutMeasurement.width
         )
      );
   };

   const cacheImages = (): Promise<void> | unknown => {
      return images?.map(image => {
         if (typeof image === "string") {
            return Image.prefetch(image);
         } else {
            return Asset.fromModule(image).downloadAsync();
         }
      });
   };

   return (
      <View
         style={[{ height: 200 }, style]}
         onLayout={e => {
            setImagesWidth(e.nativeEvent.layout.width);
            setImagesHeight(e.nativeEvent.layout.height);
         }}
      >
         <ScrollView
            style={[scrollViewStyle]}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={event => onScroll(event)}
         >
            {images?.map((value: string, i: number) =>
               !onImageClick ? (
                  findImageToRender(value, {
                     style: [{ width: imagesWidth, height: imagesHeight }, imagesStyle],
                     source: { uri: value }
                  })
               ) : (
                  <ViewTouchable
                     onPress={() => onImageClick && onImageClick(i)}
                     style={{ borderRadius: 0 }}
                     key={i}
                  >
                     {findImageToRender(value, {
                        style: [{ width: imagesWidth, height: imagesHeight }, imagesStyle],
                        source: { uri: value }
                     })}
                  </ViewTouchable>
               )
            )}
         </ScrollView>
         {showDots && <DotsIndicator totalDots={images.length} activeDot={currentPictureFocused} />}
      </View>
   );
};

export default ImagesScroll;
