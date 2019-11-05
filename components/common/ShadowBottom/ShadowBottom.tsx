import React, { Component } from "react";
import { View, Image, ImageSourcePropType, StyleProp, ViewStyle, ImageStyle } from "react-native";

export interface PropsShadowBottom {
   imageSource: ImageSourcePropType;
   style?: StyleProp<ViewStyle>;
   imageStyle?: StyleProp<ImageStyle>;
}

interface State {
   height: number;
   aspectRatio: number;
}

/**
 * Displays an image at the bottom of an element. Made for png bottom shadows.
 */
class ShadowBottom extends Component<PropsShadowBottom, State> {
   state: State = {
      height: 0,
      aspectRatio: null,
   };

   render(): JSX.Element {
      const { height, aspectRatio }: State = this.state;
      const { imageSource, style, imageStyle }: PropsShadowBottom = this.props;

      return (
         <View
            pointerEvents="none"
            onLayout={e => this.setState({ height: e.nativeEvent.layout.height })}
            style={[
               {
                  position: "absolute",
                  bottom: 0,
                  zIndex: 1,
                  width: "100%",
                  opacity: (aspectRatio && height) ? 0.6 : 0,
                  transform: [{ translateY: height }]
               }, 
               style
            ]}
         >
            <Image
               source={imageSource}
               onLoad={d => this.setState({aspectRatio: d.nativeEvent.source.width / d.nativeEvent.source.height})} 
               resizeMode={"stretch"}
               style={[
                  { 
                     width: "100%", 
                     height: undefined, 
                     aspectRatio 
                  },
                  imageStyle
               ]}
            />
         </View>
      );
   }
}

export default ShadowBottom;
