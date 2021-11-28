import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
   FlatList,
   ListRenderItem,
   NativeScrollEvent,
   NativeSyntheticEvent,
   StyleSheet,
   View
} from "react-native";
import { FAB } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import Bubble from "./Bubble/Bubble";
import ChatInputField from "./ChatInputField/ChatInputField";

export interface PropChat {
   messages?: ChatMessageProps[];
   onSend?: (props: { messageText: string; respondingToChatMessageId?: string }) => void;
   selectedMessageId?: string;
   onMessageSelect: (message: ChatMessageProps) => void;
   respondingToMessage?: ChatMessageProps;
   onRemoveReply: () => void;
}

export interface ChatMessageProps {
   authorUserId: string;
   authorName: string;
   messageId: string;
   time: number; // Time in unix format
   avatar?: string;
   textContent?: string;
   bubbleColor?: string;
   textColor?: string;
   nameColor?: string;
   isOwnMessage?: boolean;
   respondingToMessage?: ChatMessageProps;
}

const Chat: FC<PropChat> = props => {
   const { onSend, onMessageSelect, selectedMessageId, respondingToMessage, onRemoveReply } = props;

   const flatListRef = useRef<FlatList<ChatMessageProps>>(null);
   const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
   const keyExtractor = useCallback((message: ChatMessageProps) => message.messageId, []);
   const [messages, setMessages] = useState<ChatMessageProps[]>(
      [...(props.messages ?? [])].reverse()
   );

   // Effect to update the messages state when the messages arrive
   useEffect(() => {
      setMessages([...(props.messages ?? [])].reverse());
   }, [props.messages]);

   const renderChatMessage = useCallback<ListRenderItem<ChatMessageProps>>(
      ({ item: message, index }) => {
         const previousMessageIsSameAuthor =
            messages?.[index + 1]?.authorUserId === message.authorUserId;

         return (
            <Bubble
               messageData={message}
               compact={previousMessageIsSameAuthor}
               showAvatar={!message.isOwnMessage && !previousMessageIsSameAuthor}
               selected={selectedMessageId === message.messageId}
               onPress={() => onMessageSelect(message)}
               onReplyPress={message => {
                  flatListRef.current.scrollToIndex({
                     index: messages.findIndex(m => m.messageId === message.messageId),
                     animated: true
                  });
               }}
            />
         );
      },
      [messages, selectedMessageId]
   );

   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event.nativeEvent.contentOffset.y > 100 && !showScrollToBottomButton) {
         setShowScrollToBottomButton(true);
      }

      if (event.nativeEvent.contentOffset.y < 100 && showScrollToBottomButton) {
         setShowScrollToBottomButton(false);
      }
   };

   const scrollToBottom = useCallback(() => {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
   }, [flatListRef.current]);

   return (
      <View style={styles.mainContainer}>
         <View style={styles.messagesListContainer}>
            <FlatList
               data={messages}
               inverted
               keyExtractor={keyExtractor}
               renderItem={renderChatMessage}
               ref={flatListRef}
               initialNumToRender={40}
               maxToRenderPerBatch={50}
               style={styles.chatScroll}
               contentContainerStyle={styles.contentContainerStyle}
               onScroll={onScroll}
            />
            {showScrollToBottomButton && (
               <FAB
                  style={styles.buttonScrollToBottom}
                  small
                  icon="chevron-down"
                  color={currentTheme.colors.text2}
                  onPress={scrollToBottom}
               />
            )}
         </View>
         <ChatInputField
            style={styles.chatInput}
            onSend={onSend}
            respondingToMessage={respondingToMessage}
            onRemoveReply={onRemoveReply}
         />
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: currentTheme.colors.background2
   },
   messagesListContainer: {
      flex: 1,
      flexDirection: "column"
   },
   chatScroll: {},
   contentContainerStyle: {
      // flexDirection: "column-reverse",    // This is buggy at mount, sadly the only solution is array.reverse()
      paddingTop: 20, // Since the scroll is inverted top is bottom and bottom is top
      paddingBottom: 20
   },
   chatInput: {},
   buttonScrollToBottom: {
      position: "absolute",
      bottom: 30,
      right: 20,
      width: 40,
      backgroundColor: currentTheme.colors.primary
   }
});

export default Chat;
