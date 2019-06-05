import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";

export interface IProps {

}

export interface IState {
    
}

export default class SimpleComponent extends Component<IProps, IState> {
    render(): JSX.Element {
        return (
            <>

            </>
        );
    }
}

const styles: Styles = StyleSheet.create({
    example: {
        flex: 1,
    },
});
