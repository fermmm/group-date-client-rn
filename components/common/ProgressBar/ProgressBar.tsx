import React, { Component } from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";

export interface Props {
    progress: number;
    color?: string;
    fillColor?: string;
    style?: StyleProp<ViewStyle>;
    fillStyle?: StyleProp<ViewStyle>;
}

class ProgressBar extends Component<Props> {
    render(): JSX.Element {
        return (
            <View 
                style={[
                    styles.containerStyle, 
                    (this.props.color && {backgroundColor: this.props.color}), 
                    this.props.style,
                ]}
            >
                <View 
                    style={[
                        styles.fillStyle, 
                        (this.props.fillColor && {backgroundColor: this.props.fillColor}), 
                        this.props.fillStyle, 
                        {width: `${this.props.progress * 100}%`,
                    }]} 
                />
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        height: 13,
        borderRadius: currentTheme.roundness,
        backgroundColor: "#EAEAEA",
    },
    fillStyle: {
        flex: 1,
        borderRadius: currentTheme.roundness,
        backgroundColor: "#879DE1",
    },
});

export default ProgressBar;
