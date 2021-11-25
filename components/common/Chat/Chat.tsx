import React, { FC, useCallback, useEffect } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../config";
import Bubble from "./Bubble/Bubble";
import ChatInputField from "./ChatInputField/ChatInputField";

export interface PropChat {
   messages?: ChatMessageProps[];
   onSend?: (message: string) => void;
}

export interface ChatMessageProps {
   authorUserId: string;
   authorName: string;
   messageId: string;
   avatar?: string;
   textContent?: string;
   bubbleColor?: string;
   textColor?: string;
   nameColor?: string;
   isOwnMessage?: boolean;
}

const Chat: FC<PropChat> = props => {
   const { messages = [], onSend } = props;
   const flatListRef = React.useRef<FlatList<ChatMessageProps>>(null);

   const keyExtractor = useCallback((message: ChatMessageProps) => message.messageId, []);

   const renderChatMessage = useCallback<ListRenderItem<ChatMessageProps>>(
      ({ item: message, index }) => {
         const previousMessageIsSameAuthor =
            messages?.[index - 1]?.authorUserId === message.authorUserId;

         return (
            <Bubble
               messageData={message}
               previousMessageIsSameAuthor={previousMessageIsSameAuthor}
            />
         );
      },
      [messages]
   );

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
         />
         <ChatInputField style={styles.chatInput} onSend={onSend} />
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
   }
});

export default Chat;
