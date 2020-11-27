import React, { Component } from "react";
import { StyleSheet, TouchableHighlight, GestureResponderEvent } from "react-native";
import { Avatar } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import color from "color";
import { AvatarImageSource } from "react-native-paper/lib/typescript/src/components/Avatar/AvatarImage";

export interface AvatarTouchableProps {
   source: AvatarImageSource;
   onPress?: (event: GestureResponderEvent) => void;
   size?: number;
}
export interface AvatarTouchableState {}

class AvatarTouchable extends Component<AvatarTouchableProps, AvatarTouchableState> {
   static defaultProps: Partial<AvatarTouchableProps> = {};

   render(): JSX.Element {
      return (
         <TouchableHighlight
            onPress={this.props.onPress}
            underlayColor={color("white").alpha(0.5).string()}
            activeOpacity={1}
         >
            <Avatar.Image size={this.props.size} source={this.props.source} />
         </TouchableHighlight>
      );
   }
}

const styles: Styles = StyleSheet.create({});

export default AvatarTouchable;
