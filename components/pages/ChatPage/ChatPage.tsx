import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { GiftedChat, Bubble, Send, IMessage } from "react-native-gifted-chat";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { StackScreenProps } from "@react-navigation/stack";
import Dialog from "../../common/Dialog/Dialog";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { HelpBanner } from "../../common/HelpBanner/HelpBanner";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { PageBackgroundGradient } from "../../common/PageBackgroundGradient/PageBackgroundGradient";
import I18n from "i18n-js";
import { CHAT_REFRESH_INTERVAL } from "../../../config";
import { sendChatMessage, useChat, useGroup } from "../../../api/server/groups";
import moment from "moment";
import { getGroupMember } from "../../../api/tools/groupTools";
import { useUser } from "../../../api/server/user";
import { useFacebookToken } from "../../../api/third-party/facebook/facebook-login";
import color from "color";
import Avatar from "../../common/Avatar/Avatar";
import { revalidate } from "../../../api/tools/useCache";

export interface ChatPageProps extends Themed, StackScreenProps<{}> {}
export interface ChatPageState {
   messages: IMessage[];
   adviseBannerVisible: boolean;
   isContactChat: boolean;
   showIntroDialog: boolean;
   introDialogText: string;
}
interface ParamsChat {
   groupId?: string;
   contactChat?: boolean;
   introDialogText?: string;
}

const ChatPage: FC<ChatPageProps> = () => {
   const { colors, font, chatNamesColors } = useTheme();
   const { params } = useRoute<RouteProps<ParamsChat>>();
   const [messages, setMessages] = useState<IMessage[]>([]);
   const [showIntroDialog, setShowIntroDialog] = useState(params?.introDialogText != null);
   const isContactChat = params?.contactChat ?? false;
   const { token } = useFacebookToken();
   const { data: user } = useUser();
   const { data: group } = useGroup({
      groupId: params?.groupId,
      config: { enabled: !isContactChat }
   });
   const { data: groupChatFromServer } = useChat({
      groupId: params?.groupId,
      config: {
         refreshInterval: CHAT_REFRESH_INTERVAL,
         enabled: !isContactChat
      }
   });

   useFocusEffect(
      useCallback(() => {
         revalidate("group/chat" + params?.groupId);
      }, [])
   );

   useEffect(() => {
      if (groupChatFromServer == null || groupChatFromServer.messages == null) {
         return;
      }

      setMessages(
         groupChatFromServer.messages
            ?.map(message => {
               const usr = getGroupMember(message.authorUserId, group);
               return {
                  _id: message.chatMessageId,
                  text: message.messageText,
                  createdAt: moment(message.time, "X").toDate(),
                  user: {
                     _id: message.authorUserId,
                     name: usr?.name,
                     avatar: usr?.images?.[0]
                  }
               };
            })
            .reverse() ?? []
      );
   }, [groupChatFromServer]);

   const onSend = useCallback((messages: IMessage[] = []) => {
      const msg = messages[0];
      setMessages(previousMessages =>
         GiftedChat.append(previousMessages, [{ ...msg, pending: true }])
      );
      sendChatMessage({ token, groupId: group.groupId, message: messages[0].text });
   }, []);

   const getColorForUser = (userId: string) => {
      const memberIndex = group.members.findIndex(m => m.userId === userId);
      return chatNamesColors[memberIndex] ?? "black";
   };

   return (
      <>
         <AppBarHeader title={!isContactChat ? "" : "Contáctanos"} />
         <PageBackgroundGradient>
            {!isContactChat && (
               <HelpBanner
                  showCloseButton
                  animate={false}
                  text={
                     "El chat es un medio limitado que distorsiona la percepción sobre los demás, recomendamos usarlo al mínimo."
                  }
               />
            )}

            <GiftedChat
               messages={messages}
               onSend={messages => onSend(messages)}
               user={{
                  _id: user.userId
               }}
               renderUsernameOnMessage={true}
               alwaysShowSend
               placeholder={"Escribir un mensaje..."}
               renderAvatar={props => {
                  return (
                     <Avatar
                        size={48}
                        source={{ uri: props.currentMessage.user.avatar as string }}
                     />
                  );
               }}
               renderBubble={props => (
                  <Bubble
                     {...props}
                     renderTime={() => null}
                     renderTicks={() => null}
                     textStyle={{
                        right: null,
                        left: {
                           color: colors.text2
                        }
                     }}
                     usernameStyle={{
                        color: getColorForUser(props.currentMessage.user._id as string),
                        fontFamily: font.semiBold
                     }}
                     wrapperStyle={{
                        right: {
                           backgroundColor: props.currentMessage.pending
                              ? color(colors.primary).alpha(0.5).toString()
                              : colors.primary
                        },
                        left: {
                           backgroundColor: colors.primary
                        }
                     }}
                  />
               )}
               renderSend={props => (
                  <Send {...props} label={"Enviar"} textStyle={{ color: colors.primary }} />
               )}
               keyboardShouldPersistTaps={"never"}
               maxInputLength={5000}
               locale={I18n.locale}
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
