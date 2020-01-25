import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme, Caption, Text } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { QuestionData } from "../../../../api/tools/debug-tools/interfaces/questions";
import color from "color";

export interface IQuestionProfileProps extends Themed {
   questionData: QuestionData;
}

class QuestionInProfileCard extends Component<IQuestionProfileProps> {
   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { questionData }: IQuestionProfileProps = this.props;
      const answerMatches: boolean = true; // Implement compare logic here

      return (
         <View style={[
            styles.mainContainer,
            {
               backgroundColor: color(colors.background).darken(0.05).string(),
               borderColor: !answerMatches && color(colors.statusBad).alpha(0.6).string(),
            },
            !answerMatches && styles.border,
         ]}>
            <Text style={{ color: colors.text }}>
               {
                  questionData.shortVersion ? 
                     questionData.shortVersion 
                  : 
                     questionData.text
               }
            </Text>
            <Caption style={{ color: colors.text }}>
               {
                  !questionData.multipleAnswersAllowed ?
                     questionData.answers[0].shortVersion ? 
                        questionData.answers[0].shortVersion 
                     : 
                        questionData.answers[0].text
                  :
                     `${questionData.answers[0].text}, ${questionData.answers[1].text}` // Implemet multiple questions separated by comma here
               }
            </Caption>
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
