import React, { FC, useState } from "react";
import { View, Image, ImageSourcePropType, StyleProp, ViewStyle, ImageStyle } from "react-native";

export interface PropsShadowBottom {
   imageSource: ImageSourcePropType;
   style?: StyleProp<ViewStyle>;
   imageStyle?: StyleProp<ImageStyle>;
}

/**
 * Displays an image at the bottom of an element. Made for png bottom shadows.
 */
const ShadowBottom: FC<PropsShadowBottom> = props => {
   const [height, setHeight] = useState(20);
   const [aspectRatio, setAspectRatio] = useState<number>(1);
   const { imageSource, style, imageStyle }: PropsShadowBottom = props;

   return (
      <View
         pointerEvents="none"
         onLayout={e => setHeight(e.nativeEvent.layout.height)}
         style={[
            {
               position: "absolute",
               bottom: 0,
               zIndex: 2000,
               width: "100%",
               transform: [{ translateY: height }]
            },
            style,
            (aspectRatio == null || height == null) && { opacity: 0 }
         ]}
      >
         <Image
            source={imageSource}
            onLoad={d => setAspectRatio(d.nativeEvent.source.width / d.nativeEvent.source.height)}
            resizeMode={"stretch"}
            style={[
               {
                  width: "100%",
                  // height: undefined,
                  aspectRatio
               },
               imageStyle
            ]}
         />
      </View>
   );
};

export default ShadowBottom;
