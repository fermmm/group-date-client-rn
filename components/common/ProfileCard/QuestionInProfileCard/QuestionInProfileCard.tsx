import React, { Component } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme, Caption, Text, Surface } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import color from "color";

export interface IQuestionProfileProps extends Themed {
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
        const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
        const { answerMatches }: IQuestionProfileProps = this.props;

        return (
            <View style={[
                styles.mainContainer, 
                {
                    backgroundColor: color(colors.background).darken(0.05).string(),
                    borderColor: !answerMatches && color(colors.statusBad).alpha(0.6).string(),
                },
                !answerMatches && styles.border,
             ]}>
                <Text style={{color: colors.text}}>{this.props.questionText}</Text>
                <Caption style={{color: colors.text}}>{this.props.responseText}</Caption>
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
