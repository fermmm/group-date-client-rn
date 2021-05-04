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
   const [positionY, setPositionY] = useState<number>(0);
   const [aspectRatio, setAspectRatio] = useState<number>(16);
   const { imageSource, style, imageStyle }: PropsShadowBottom = props;

   return (
      <View
         pointerEvents="none"
         onLayout={e => setPositionY(e.nativeEvent.layout.height)}
         style={[
            {
               position: "absolute",
               bottom: 0,
               zIndex: 2,
               width: "100%",
               transform: [{ translateY: positionY ?? 0 }]
            },
            style,
            aspectRatio == null || positionY == null ? { opacity: 0 } : {}
         ]}
      >
         <Image
            source={imageSource}
            onLoad={d => setAspectRatio(d.nativeEvent.source.width / d.nativeEvent.source.height)}
            resizeMode={"stretch"}
            style={[
               {
                  width: "100%",
                  height: undefined,
                  aspectRatio: aspectRatio ?? 16
               },
               imageStyle
            ]}
         />
      </View>
   );
};

export default ShadowBottom;
