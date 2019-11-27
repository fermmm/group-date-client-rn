import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Banner } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/themes/types/Themed";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { GiftedChat, IMessage, Bubble, Send } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AppBarHeader from "../../../common/AppBarHeader/AppBarHeader";
import color from "color";
import { NavigationInjectedProps, withNavigation, NavigationScreenProp } from "react-navigation";
import DialogError from "../../../common/DialogError/DialogError";

export interface ChatPageProps extends Themed, NavigationInjectedProps { }
export interface ChatPageState {
   messages: IMessage[];
   adviseBannerVisible: boolean;
   isContactChat: boolean;
   showIntroDialog: boolean;
   introDialogText: string;
}

class ChatPage extends Component<ChatPageProps, ChatPageState> {
   static defaultProps: Partial<ChatPageProps> = {};
   navigation: NavigationScreenProp<{}> = this.props.navigation;
   
   state: ChatPageState = {
      messages: [],
      adviseBannerVisible: true,
      isContactChat: this.navigation.getParam("contactChat") || false,
      showIntroDialog: this.navigation.getParam("introDialogText") || false,
      introDialogText: this.navigation.getParam("introDialogText")
   };

   componentWillMount(): void {
      this.setState({
         messages: [
            {
               _id: 1,
               text: "oooaaaaaa",
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
      const { isContactChat, showIntroDialog, introDialogText }: Partial<ChatPageState> = this.state;

      return (
         <>
            <AppBarHeader title={!isContactChat ? "Chat" : "Contactanos"} />
            {
               !isContactChat && 
                  <Banner
                     visible={this.state.adviseBannerVisible}
                     style={{backgroundColor: color(colors.background).darken(0.04).toString(), elevation: 12, marginBottom: 25}}
                     actions={[
                        {
                           label: "Entendido",
                           onPress: () => this.setState({ adviseBannerVisible: false }),
                        },
                     ]}
                  >
                     No recomendamos usar el chat para conocerse o evaluarse, es un medio limitado que distorsiona la percepción y además suele ser tedioso
                  </Banner>
            }
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
            <DialogError
               visible={showIntroDialog}
               onDismiss={() => this.setState({ showIntroDialog: false })}
            >
               {introDialogText}
            </DialogError>
            <KeyboardSpacer topSpacing={30} />
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
});

export default withNavigation(withTheme(ChatPage));