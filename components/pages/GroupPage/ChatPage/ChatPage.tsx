import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Banner } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { GiftedChat, IMessage, Bubble, Send } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export interface ChatPageProps extends Themed { }
export interface ChatPageState {
   messages: IMessage[];
   adviseBannerVisible: boolean;
}

class ChatPage extends Component<ChatPageProps, ChatPageState> {
   static defaultProps: Partial<ChatPageProps> = {};
   state: ChatPageState = {
      messages: [],
      adviseBannerVisible: true
   };

   componentWillMount(): void {
      this.setState({
         messages: [
            {
               _id: 1,
               text: "Olis",
               createdAt: new Date(),
               user: {
                  _id: 2,
                  name: "Alberto",
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
         <>
            <AppBarHeader title={"Chat"} />
            <Banner
               visible={this.state.adviseBannerVisible}
               actions={[
                  {
                     label: "Entendido",
                     onPress: () => this.setState({ adviseBannerVisible: false }),
                  },
               ]}
            >
               No recomendamos que usen el chat para conocerse, es un medio limitado que distorsiona la vision de los demás de forma negativa.
            </Banner>
            <GiftedChat
               messages={this.state.messages}
               onSend={messages => this.onSend(messages)}
               user={{
                  _id: 1,
               }}
               renderUsernameOnMessage={true}
               placeholder={"Escribir un mensaje..."}
               renderBubble={props =>
                  <Bubble
                     {...props}
                     // tslint:disable-next-line: ban-ts-ignore-except-imports
                     // @ts-ignore
                     wrapperStyle={{
                        right: { backgroundColor: colors.primary }
                     }}
                  />
               }
               renderSend={props =>
                  <Send
                     {...props}
                     label={"Enviar"}
                     textStyle={{ color: colors.primary }}
                  />
               }
               keyboardShouldPersistTaps="never"
               scrollToBottom
               alignTop
            />
            <KeyboardSpacer topSpacing={30} />
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
});

export default withTheme(ChatPage);