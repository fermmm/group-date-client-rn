import React, { FC, ComponentProps } from "react";
import {
   StyleSheet,
   GestureResponderEvent,
   ImageURISource,
   ViewStyle,
   StyleProp
} from "react-native";
import { Avatar as PaperAvatar } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import color from "color";
import { useServerInfo } from "../../../api/server/server-info";
import { prepareUrl } from "../../../api/tools/httpRequest";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";

export interface PropsAvatar {
   source: ImageURISource;
   onPress?: (event: GestureResponderEvent) => void;
   size?: number;
   style?: StyleProp<ViewStyle>;
}

const Avatar: FC<PropsAvatar> = props => {
   const { source, size, onPress, style } = props;
   const { data: serverInfo } = useServerInfo();

   if (!serverInfo || !source?.uri) {
      return null;
   }

   const finalSource = {
      ...source,
      uri: prepareUrl(serverInfo.imagesHost + source.uri.replace("big", "small"))
   };

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
