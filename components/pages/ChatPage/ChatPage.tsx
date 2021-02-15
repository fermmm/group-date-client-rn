import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { GiftedChat, Bubble, Send, IMessage } from "react-native-gifted-chat";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { StackScreenProps } from "@react-navigation/stack";
import Dialog from "../../common/Dialog/Dialog";
import { useRoute } from "@react-navigation/native";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { PageBackgroundGradient } from "../../common/PageBackgroundGradient/PageBackgroundGradient";

export interface ChatPageProps extends Themed, StackScreenProps<{}> {}
export interface ChatPageState {
   messages: IMessage[];
   adviseBannerVisible: boolean;
   isContactChat: boolean;
   showIntroDialog: boolean;
   introDialogText: string;
}
interface ParamsChat {
   contactChat: boolean;
   introDialogText: string;
}

const ChatPage: FC<ChatPageProps> = () => {
   const { colors } = useTheme();
   const { params } = useRoute<RouteProps<ParamsChat>>();
   const [messages, setMessages] = useState<IMessage[]>([]);
   const [showIntroDialog, setShowIntroDialog] = useState(params?.introDialogText != null);
   const isContactChat = params?.contactChat ?? false;

   useEffect(() => {
      setMessages([
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
      ]);
   }, []);

   const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
   }, []);

   return (
      <>
         <AppBarHeader title={!isContactChat ? "Chat" : "Contáctanos"} />
         <PageBackgroundGradient>
            {!isContactChat && (
               <HelpBanner
                  showCloseButton
                  text={
                     "El chat es un medio limitado que distorsiona la percepción sobre los demás, recomendamos usarlo al mínimo."
                  }
               />
            )}

            <GiftedChat
               messages={messages}
               onSend={messages => onSend(messages)}
               user={{
                  _id: 1
               }}
               renderUsernameOnMessage={true}
               placeholder={"Escribir un mensaje..."}
               renderBubble={props => (
                  <Bubble
                     {...props}
                     wrapperStyle={{
                        right: { backgroundColor: colors.primary }
                     }}
                  />
               )}
               renderSend={props => (
                  <Send {...props} label={"Enviar"} textStyle={{ color: colors.primary }} />
               )}
               keyboardShouldPersistTaps={"never"}
               scrollToBottom
               alignTop
            />
            <Dialog visible={showIntroDialog} onDismiss={() => setShowIntroDialog(false)}>
               {params?.introDialogText}
            </Dialog>
         </PageBackgroundGradient>
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default ChatPage;
