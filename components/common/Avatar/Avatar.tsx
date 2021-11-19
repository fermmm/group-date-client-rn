import React, { FC } from "react";
import { StyleSheet, GestureResponderEvent, ViewStyle, StyleProp } from "react-native";
import { Avatar as PaperAvatar } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";
import { ImageSize, useImageFullUrl } from "../../../api/tools/useImageFullUrl";

export interface PropsAvatar {
   source: string;
   onPress?: (event: GestureResponderEvent) => void;
   size?: number;
   style?: StyleProp<ViewStyle>;
}

const Avatar: FC<PropsAvatar> = props => {
   const { source, size, onPress, style } = props;
   const { getImageFullUrl, isLoading } = useImageFullUrl();

   if (isLoading || !source) {
      return null;
   }

   const finalSource = getImageFullUrl(source, ImageSize.Small);

   if (onPress != null) {
      return (
         <ViewTouchable onPress={onPress}>
            <PaperAvatar.Image size={size} source={finalSource} style={style} />
         </ViewTouchable>
      );
   } else {
      return <PaperAvatar.Image size={size} source={finalSource} />;
   }
};

const styles: Styles = StyleSheet.create({});

export default Avatar;
