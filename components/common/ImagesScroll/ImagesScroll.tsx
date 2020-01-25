import React, { Component } from "react";
import { View, Image, StyleProp, ViewStyle, ImageStyle, TouchableHighlight, ImageProps, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import DotsIndicator from "../DotsIndicator/DotsIndicator";
import { Asset } from "expo-asset";

export interface ImagesScrollProps {
   images: string[];
   renderImage?: (image: string, imageProps: ImageProps) => JSX.Element;
   onImageClick?: (index: number) => void;
   style?: StyleProp<ViewStyle>;
   scrollViewStyle?: StyleProp<ViewStyle>;
   imagesStyle?: StyleProp<ImageStyle>;
   showDots?: boolean;
}

interface ImagesScrollState {
   imagesWidth: number;
   imagesHeight: number;
   currentPictureFocused: number;
}

export default class ImagesScroll extends Component<ImagesScrollProps, ImagesScrollState> {
   static defaultProps: Partial<ImagesScrollProps> = {
      showDots: true
   };
   state: ImagesScrollState = {
      imagesWidth: 0,
      imagesHeight: 0,
      currentPictureFocused: 0
   };

   componentDidMount(): void {
      this.cacheImages();
   }

   render(): JSX.Element {
      const { imagesWidth, imagesHeight, currentPictureFocused }: Partial<ImagesScrollState> = this.state;
      const { images, style, imagesStyle, scrollViewStyle, onImageClick, showDots }: Partial<ImagesScrollProps> = this.props;

      return (
         <View style={[{ height: 200 }, style]} onLayout={e => this.setState({ imagesWidth: e.nativeEvent.layout.width, imagesHeight: e.nativeEvent.layout.height })}>
            <ScrollView 
               style={[scrollViewStyle]} 
               horizontal={true} 
               pagingEnabled={true} 
               showsHorizontalScrollIndicator={false}
               onMomentumScrollEnd={(event) => this.onMomentumScrollEnd(event)}
            >
               {
                  images.map((value: string, i: number) =>
                     !onImageClick
                        ?
                        this.renderImage(value, {
                           style: [{ width: imagesWidth, height: imagesHeight }, imagesStyle],
                           source: { uri: value },
                        })
                        :
                        <TouchableHighlight
                           onPress={() => onImageClick && onImageClick(i)}
                           underlayColor="#4D4D4D"
                           activeOpacity={0.5}
                           key={i}
                        >
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
            {
               showDots &&
                  <DotsIndicator totalDots={images.length} activeDot={currentPictureFocused} />
            }
         </View>
      );
   }

   renderImage(image: string, imageProps: ImageProps): JSX.Element {
      return this.props.renderImage ?
         this.props.renderImage(image, imageProps)
         :
         <Image {...imageProps} key={image} />;
   }

   onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): void {
      this.setState({
         currentPictureFocused: 
            Math.round(Math.ceil(event.nativeEvent.contentOffset.x) / event.nativeEvent.layoutMeasurement.width)
      });
   }

   cacheImages(): Promise<void> | unknown {
      return this.props.images.map(image => {
         if (typeof image === "string") {
            return Image.prefetch(image);
         } else {
            return Asset.fromModule(image).downloadAsync();
         }
      });
   }
}
