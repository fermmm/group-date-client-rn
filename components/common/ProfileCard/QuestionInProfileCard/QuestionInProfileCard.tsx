import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme, Caption, Text, Surface } from "react-native-paper";
import { IThemed, ITheme } from "../../../../common-tools/ts-tools/Themed";
import color from "color";

export interface IQuestionProfileProps extends IThemed {
    questionText: string;
    responseText: string;
    comparisonColor?: "match" | "compatible" | "opposite";
}
export interface IQuestionProfileState { }

class QuestionInProfileCard extends Component<IQuestionProfileProps, IQuestionProfileState> {
    static defaultProps: Partial<IQuestionProfileProps> = {

    };

    render(): JSX.Element {
        const { colors }: ITheme = this.props.theme;

        return (
            <View style={[styles.mainContainer, {backgroundColor: color(colors.background2).lighten(0.15).string()}]}>
                <Text>{this.props.questionText}</Text>
                <Caption >{this.props.responseText}</Caption>
            </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    mainContainer: {
        alignSelf: "flex-start",
        padding: 10,
        marginRight: 5,
        marginBottom: 5,
    },
});

export default withTheme(QuestionInProfileCard);
