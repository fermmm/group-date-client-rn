import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme, Banner } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { GiftedChat, IMessage, Bubble, Send } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import color from "color";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import DialogError from "../../common/DialogError/DialogError";
import { withNavigation } from "@react-navigation/compat";
import { Route } from "@react-navigation/native";

export interface ChatPageProps extends Themed, StackScreenProps<{}> {}
export interface ChatPageState {
   messages: IMessage[];
   adviseBannerVisible: boolean;
   isContactChat: boolean;
   showIntroDialog: boolean;
   introDialogText: string;
}
interface RouteParams {
   contactChat: boolean;
   introDialogText: string;
}

class ChatPage extends Component<ChatPageProps, ChatPageState> {
   static defaultProps: Partial<ChatPageProps> = {};
   navigation: StackNavigationProp<Record<string, {}>> = this.props.navigation;
   route: Route<string, RouteParams> = this.props.route as Route<string, RouteParams>;

   state: ChatPageState = {
      messages: [],
      adviseBannerVisible: true,
      isContactChat: this.route.params.contactChat ?? false,
      showIntroDialog: this.route.params.introDialogText != null,
      introDialogText: this.route.params.introDialogText
   };

   componentDidMount(): void {
      this.setState({
         messages: [
            {
               _id: 1,
               text: "olis como andan",
               createdAt: new Date(),
               user: {
                  _id: 2,
                  name: "alberto666",
                  avatar: "https://placeimg.com/140/140/any"
               }
            }
         ]
      });
   }

   onSend(messages: IMessage[] = []): void {
      this.setState(previousState => ({
         messages: GiftedChat.append(previousState.messages, messages)
      }));
   }

   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;
      const {
         isContactChat,
         showIntroDialog,
         introDialogText
      }: Partial<ChatPageState> = this.state;

      return (
         <>
            <AppBarHeader title={!isContactChat ? "Chat" : "Contactanos"} />
            {!isContactChat && (
               <Banner
                  visible={this.state.adviseBannerVisible}
                  style={{
                     backgroundColor: color(colors.background).darken(0.04).toString(),
                     elevation: 12,
                     marginBottom: 25
                  }}
                  actions={[
                     {
                        label: "Entendido",
                        onPress: () => this.setState({ adviseBannerVisible: false })
                     }
                  ]}
               >
                  El chat es un medio limitado que distorsiona la percepción sobre los demás,
                  recomendamos usarlo al mínimo.
               </Banner>
            )}
            <GiftedChat
               messages={this.state.messages}
               onSend={messages => this.onSend(messages)}
               user={{
                  _id: 1
               }}
               renderUsernameOnMessage={true}
               placeholder={"Escribir un mensaje..."}
               renderBubble={props => (
                  <Bubble
                     {...props}
                     // tslint:disable-next-line: ban-ts-ignore-except-imports
                     // @ts-ignore
                     wrapperStyle={{
                        right: { backgroundColor: colors.primary }
                     }}
                  />
               )}
               renderSend={props => (
                  <Send {...props} label={"Enviar"} textStyle={{ color: colors.primary }} />
               )}
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

const styles: Styles = StyleSheet.create({});

// tslint:disable-next-line: ban-ts-ignore-except-imports
// @ts-ignore
export default withNavigation(withTheme(ChatPage));
