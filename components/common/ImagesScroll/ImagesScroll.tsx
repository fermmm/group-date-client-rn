import React, { FC, useState } from "react";
import {
   View,
   Image,
   StyleProp,
   ViewStyle,
   ImageStyle,
   ImageProps,
   ScrollView,
   NativeSyntheticEvent,
   NativeScrollEvent,
   ImageSourcePropType
} from "react-native";
import DotsIndicator from "../DotsIndicator/DotsIndicator";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";

export interface PropsImagesScroll {
   images: ImageSourcePropType[];
   renderImage?: (
      image: ImageSourcePropType,
      imageProps: ImageProps,
      key: string | number
   ) => JSX.Element;
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

   const findImageToRender = (
      image: ImageSourcePropType,
      imageProps: ImageProps,
      key: string | number
   ): JSX.Element => {
      return renderImage ? (
         renderImage(image, imageProps, key)
      ) : (
         <Image {...imageProps} key={key} />
      );
   };

   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setCurrentPictureFocused(
         Math.round(
            Math.ceil(event.nativeEvent.contentOffset.x) / event.nativeEvent.layoutMeasurement.width
         )
      );
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
            {images?.map((value: ImageSourcePropType, i: number) => (
               <ViewTouchable
                  onPress={onImageClick ? () => onImageClick?.(i) : null}
                  style={{ borderRadius: 0 }}
                  key={i}
               >
                  {findImageToRender(
                     value,
                     {
                        style: [{ width: imagesWidth, height: imagesHeight }, imagesStyle],
                        source: value
                     },
                     i
                  )}
               </ViewTouchable>
            ))}
         </ScrollView>
         {showDots && <DotsIndicator totalDots={images.length} activeDot={currentPictureFocused} />}
      </View>
   );
};

export default ImagesScroll;
