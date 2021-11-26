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
}

const Chat: FC<PropChat> = props => {
   const {
      messages = [],
      onSend,
      onMessageSelect,
      selectedMessageId,
      respondingToMessage,
      onRemoveReply
   } = props;
   const flatListRef = useRef<FlatList<ChatMessageProps>>(null);
   const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
   const keyExtractor = useCallback((message: ChatMessageProps) => message.messageId, []);

   const renderChatMessage = useCallback<ListRenderItem<ChatMessageProps>>(
      ({ item: message, index }) => {
         const previousMessageIsSameAuthor =
            messages?.[index - 1]?.authorUserId === message.authorUserId;

         return (
            <Bubble
               messageData={message}
               previousMessageIsSameAuthor={previousMessageIsSameAuthor}
               selected={selectedMessageId === message.messageId}
               onPress={() => onMessageSelect(message)}
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
      flatListRef.current?.scrollToEnd({ animated: true });
   }, [flatListRef.current]);

   return (
      <View style={styles.mainContainer}>
         <FlatList
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderChatMessage}
            ref={flatListRef}
            initialNumToRender={40}
            maxToRenderPerBatch={50}
            inverted
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
   chatScroll: {},
   contentContainerStyle: {
      flexDirection: "column-reverse",
      paddingTop: 75, // Since the scroll is inverted top is bottom and bottom is top
      paddingBottom: 20
   },
   chatInput: {
      position: "absolute"
   },
   buttonScrollToBottom: {
      position: "absolute",
      bottom: 80,
      right: 19,
      width: 40,
      backgroundColor: currentTheme.colors.primary
   }
});

export default Chat;
