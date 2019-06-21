import React, { Component } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme, Caption, Text, Surface } from "react-native-paper";
import { IThemed, ITheme } from "../../../../common-tools/ts-tools/Themed";
import color from "color";

export interface IQuestionProfileProps extends IThemed {
    questionText: string;
    responseText: string;
    answerMatches?: boolean;
}
export interface IQuestionProfileState { }

class QuestionInProfileCard extends Component<IQuestionProfileProps, IQuestionProfileState> {
    static defaultProps: Partial<IQuestionProfileProps> = {
        answerMatches: true,
    };

    render(): JSX.Element {
        const { colors }: ITheme = this.props.theme;
        const { answerMatches }: IQuestionProfileProps = this.props;

        return (
            <View style={[
                styles.mainContainer, 
                {
                    backgroundColor: color(colors.background2).lighten(0.15).string(),
                    borderColor: !answerMatches && color(colors.statusBad).alpha(0.6).string(),
                },
                !answerMatches && styles.border,
             ]}>
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
    border: {
        borderBottomWidth: 1,
    },
});

export default withTheme(QuestionInProfileCard);
