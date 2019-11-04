import React, { Component } from "react";
import { StyleSheet, TouchableHighlight, GestureResponderEvent } from "react-native";
import { Avatar } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ImageProps } from "react-native-paper/typings/components/Avatar";
import color from "color";

export interface AvatarTouchableProps extends ImageProps {
   onPress?: (event: GestureResponderEvent) => void;
}
export interface AvatarTouchableState { }

class AvatarTouchable extends Component<AvatarTouchableProps, AvatarTouchableState> {
   static defaultProps: Partial<AvatarTouchableProps> = {};

   render(): JSX.Element {
      return (
         <TouchableHighlight
            onPress={this.props.onPress}
            underlayColor={color("white").alpha(0.5).string()}
            activeOpacity={1}
         >
            <Avatar.Image {...this.props} />
         </TouchableHighlight>
      );
   }
}

const styles: Styles = StyleSheet.create({
});

export default AvatarTouchable;
