import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

export interface ChatPageProps extends Themed { }
export interface ChatPageState { 
   messages: IMessage[];
}

class ChatPage extends Component<ChatPageProps, ChatPageState> {
   static defaultProps: Partial<ChatPageProps> = {};
   state: ChatPageState = {
      messages: [],
   };

   componentWillMount(): void {
      this.setState({
         messages: [
            {
               _id: 1,
               text: "Hello developer",
               createdAt: new Date(),
               user: {
                  _id: 2,
                  name: "React Native",
                  avatar: "https://placeimg.com/140/140/any",
               },
            },
         ],
      });
   }

   onSend(messages: IMessage[] = []): void {
      this.setState(previousState => ({
         messages: GiftedChat.append(previousState.messages, messages),
      }));
   }

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
               _id: 1,
            }}
         />
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
   },
});

export default withTheme(ChatPage);