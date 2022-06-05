import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, ToastAndroid, View } from "react-native";
import { Text } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { PageBackgroundGradient } from "../../common/PageBackgroundGradient/PageBackgroundGradient";
import { CHAT_REFRESH_INTERVAL } from "../../../config";
import { sendChatMessage, useChat, useGroup } from "../../../api/server/groups";
import moment from "moment";
import { getGroupMember } from "../../../api/tools/groupTools";
import { useUser } from "../../../api/server/user";
import { useAuthentication } from "../../../api/authentication/useAuthentication";
import color from "color";
import { revalidate } from "../../../api/tools/useCache/useCache";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";
import { getColorForUser, getUnknownUsersFromChat } from "./tools/chat-tools";
import {
   stringIsEmptyOrSpacesOnly,
   toFirstUpperCase
} from "../../../common-tools/js-tools/js-tools";
import { useGoBackExtended } from "../../../common-tools/navigation/useGoBackExtended";
import { analyticsLogEvent } from "../../../common-tools/analytics/tools/analyticsLog";
import Chat, { ChatMessageProps } from "../../common/Chat/Chat";
import ChatAppBar from "./ChatAppBar/ChatAppBar";
import { ChatMessage } from "../../../api/server/shared-tools/endpoints-interfaces/common";
import { useGroupSeenChecker } from "../GroupsListPage/tools/useGroupSeenChecker";
import { decodeString } from "../../../api/server/shared-tools/utility-functions/decodeString";
import { GroupChat } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { useDialogModal } from "../../common/DialogModal/tools/useDialogModal";

export interface ChatPageState {
   isContactChat: boolean;
}

interface ParamsChat {
   groupId?: string;
   contactChat?: boolean;
   introDialogText?: string;
}

const ChatPage: FC = () => {
   const { colors, chatNamesColors } = useTheme();
   const analyticsSent = useRef(false);
   const { params } = useRoute<RouteProps<ParamsChat>>();
   const [messages, setMessages] = useState<ChatMessageProps[]>([]);
   const [messageSelected, setMessageSelected] = useState<ChatMessageProps>();
   const [respondingToMessage, setRespondingToMessage] = useState<ChatMessageProps>();
   const { openDialogModal } = useDialogModal();
   const isContactChat = params?.contactChat ?? false;
   const { token } = useAuthentication();
   const { data: user } = useUser();
   const { data: group } = useGroup({
      groupId: params?.groupId,
      config: { enabled: !isContactChat }
   });
   const { data: groupChatFromServer, revalidate: revalidateChat } = useChat({
      groupId: params?.groupId,
      config: {
         refreshInterval: CHAT_REFRESH_INTERVAL,
         enabled: !isContactChat
      }
   });
   const { goBack } = useGoBackExtended({
      whenBackNotAvailable: { goToRoute: "Group", params: { groupId: params?.groupId } }
   });
   const isLoading: boolean = group == null || user == null;
   const ownMessageBubbleColor = color(colors.specialBackground1)
      .darken(0.3)
      .desaturate(0.75)
      .toString();
   const ownMessageNameColor = color(colors.specialBackground1)
      .lighten(0.2)
      .desaturate(0.2)
      .toString();

   useFocusEffect(
      useCallback(() => {
         revalidate("group/chat" + params?.groupId);
      }, [])
   );
   useGroupSeenChecker();

   /**
    * Effect to transform the format of the chat from server to Chat component.
    * Also revalidate the chat request when an unknown user is found.
    */
   useEffect(() => {
      if (groupChatFromServer == null) {
         return;
      }

      let groupChatFromServerParsed: GroupChat;

      try {
         groupChatFromServerParsed = JSON.parse(
            decodeString(groupChatFromServer as unknown as string)
         );
      } catch (error) {
         // Just in case, but it should never br "object" since groupChatFromServer is an encoded string that cannot be parsed just from server, decodeString() needs to be called first.
         if (typeof groupChatFromServer === "object") {
            groupChatFromServerParsed = groupChatFromServer;
         } else {
            openDialogModal({ message: "Error while parsing the chat" });
            return;
         }
      }

      if (groupChatFromServerParsed.messages == null) {
         return;
      }

      setMessages([
         ...groupChatFromServerParsed.messages.map(message =>
            fromMessageDataToChatMessageProps(groupChatFromServerParsed.messages, message)
         )
      ]);

      if (getUnknownUsersFromChat(group, groupChatFromServer.messages).length > 0) {
         revalidate("group" + params?.groupId);
      }
   }, [groupChatFromServer, group]);

   const handleSend = useCallback(
      async (props: { messageText: string; respondingToChatMessageId?: string }) => {
         const { messageText, respondingToChatMessageId } = props;

         if (group == null || user == null) {
            return;
         }

         if (stringIsEmptyOrSpacesOnly(messageText)) {
            return;
         }

         const message: ChatMessageProps = {
            authorUserId: user.userId,
            authorName: user.name,
            messageId: String(messages.length),
            textContent: messageText.trim(),
            isOwnMessage: true,
            time: moment().unix(),
            nameColor: ownMessageNameColor,
            bubbleColor: color(colors.specialBackground1).alpha(0.5).desaturate(0.5).toString(),
            respondingToMessage: messages.find(m => m.messageId === respondingToChatMessageId)
         };

         setMessages([...messages, message]);
         await sendChatMessage({
            token,
            groupId: group.groupId,
            message: message.textContent,
            respondingToChatMessageId
         });
         await revalidateChat();
         analyticsLogEvent("chat_message_sent");
      },
      [messages]
   );

   const handleMessageSelect = (message: ChatMessageProps) => {
      if (messageSelected?.messageId === message.messageId) {
         setMessageSelected(undefined);
      } else {
         setMessageSelected(message);
      }
   };

   const handleMessageCopy = () => {
      Clipboard.setString(messageSelected?.textContent ?? "");
      setMessageSelected(undefined);
      if (Platform.OS === "android") {
         ToastAndroid.show("Mensaje copiado", ToastAndroid.LONG);
      }
   };

   const handleMessageReply = () => {
      setRespondingToMessage(messageSelected);
      setMessageSelected(undefined);
   };

   const handleRemoveReply = () => {
      setRespondingToMessage(undefined);
   };

   const fromMessageDataToChatMessageProps = (
      allMessages: ChatMessage[],
      message: ChatMessage,
      computeRespondingMessage = true
   ): ChatMessageProps => {
      if (message == null || allMessages == null) {
         return null;
      }

      const usr = getGroupMember(message.authorUserId, group);
      const isOwnMessage = message.authorUserId === user?.userId;
      const bubbleColor = isOwnMessage
         ? ownMessageBubbleColor
         : color(getColorForUser(message.authorUserId, group, chatNamesColors))
              .darken(0.3)
              .desaturate(0.7)
              .toString();
      const nameColor = isOwnMessage
         ? ownMessageNameColor
         : color(getColorForUser(message.authorUserId, group, chatNamesColors, "white"))
              .desaturate(0)
              .lighten(0.6)
              .toString();

      return {
         authorUserId: message.authorUserId,
         authorName: usr?.name != null ? toFirstUpperCase(usr.name) : "[Abandonó el grupo]",
         messageId: message.chatMessageId,
         avatar: usr?.images?.[0],
         textContent: message.messageText,
         time: message.time,
         isOwnMessage,
         bubbleColor,
         nameColor,
         textColor: "white",
         respondingToMessage: computeRespondingMessage
            ? fromMessageDataToChatMessageProps(
                 allMessages,
                 allMessages.find(m => m.chatMessageId === message.respondingToChatMessageId),
                 false
              )
            : undefined
      };
   };

   if (isContactChat) {
      return (
         <>
            <ChatAppBar
               isContactChat={isContactChat}
               selectedMessage={messageSelected}
               onBackPress={goBack}
               onCopyPress={handleMessageCopy}
               onReplyPress={handleMessageReply}
            />
            <PageBackgroundGradient>
               <Text style={{ padding: 45, fontSize: 20 }}>Sección sin terminar =(</Text>
            </PageBackgroundGradient>
         </>
      );
   }

   if (isLoading) {
      return <LoadingAnimation renderMethod={RenderMethod.FullScreen} />;
   }

   return (
      <>
         <ChatAppBar
            isContactChat={isContactChat}
            selectedMessage={messageSelected}
            onBackPress={goBack}
            onCopyPress={handleMessageCopy}
            onReplyPress={handleMessageReply}
         />
         <PageBackgroundGradient>
            {/* 
               !isContactChat && (
                  <HelpBanner
                     showCloseButton
                     animate={false}
                     text={
                        "Concejo: El medio escrito desmotiva a socializar en persona, es mejor usarlo con moderación."
                     }
                     rememberClose={true}
                     rememberCloseTimeInSeconds={DAY_IN_SECONDS * 3}
                  />
               )
            */}
            <Chat
               messages={messages}
               onSend={handleSend}
               selectedMessageId={messageSelected?.messageId}
               onMessageSelect={handleMessageSelect}
               respondingToMessage={respondingToMessage}
               onRemoveReply={handleRemoveReply}
               ownMessageBubbleColor={ownMessageBubbleColor}
               ownMessageNameColor={ownMessageNameColor}
               externalMessageBubbleColor={color("white").darken(0.67).toString()}
            />
         </PageBackgroundGradient>
      </>
   );
};

const styles: Styles = StyleSheet.create({});

export default ChatPage;
