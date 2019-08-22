import React, { Component } from "react";
import { StyleSheet, TouchableHighlight, GestureResponderEvent } from "react-native";
import { Avatar } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { ImageProps } from "react-native-paper/typings/components/Avatar";

export interface AvatarTouchableProps extends ImageProps { 
    onPress?: (event: GestureResponderEvent) => void;
}
export interface AvatarTouchableState { }

class AvatarTouchable extends Component<AvatarTouchableProps, AvatarTouchableState> {
    static defaultProps: Partial<AvatarTouchableProps> = {};

    render(): JSX.Element {
        return (
            <TouchableHighlight onPress={this.props.onPress}>
                <Avatar.Image {...this.props} />
            </TouchableHighlight>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

export default AvatarTouchable;
