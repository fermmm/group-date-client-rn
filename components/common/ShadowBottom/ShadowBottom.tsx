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
   const [height, setHeight] = useState(0);
   const [aspectRatio, setAspectRatio] = useState<number>(null);
   const { imageSource, style, imageStyle }: PropsShadowBottom = props;

   return (
      <View
         pointerEvents="none"
         onLayout={e => setHeight(e.nativeEvent.layout.height)}
         style={[
            {
               position: "absolute",
               bottom: 0,
               zIndex: 1,
               width: "100%",
               transform: [{ translateY: height }]
            },
            style,
            (!aspectRatio || !height) && { opacity: 0 }
         ]}
         key={height}
      >
         <Image
            source={imageSource}
            onLoad={d => setAspectRatio(d.nativeEvent.source.width / d.nativeEvent.source.height)}
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
};

export default ShadowBottom;
