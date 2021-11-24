import React, { FC, useCallback, useEffect } from "react";
import { FlatList, ListRenderItem, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { ChatMessage } from "../../../api/server/shared-tools/endpoints-interfaces/common";
import { Styles } from "../../../common-tools/ts-tools/Styles";

export interface PropChat {
   messages?: ChatMessage[];
}

const Chat: FC<PropChat> = props => {
   const { messages = [] } = props;
   const flatListRef = React.useRef<FlatList<ChatMessage>>(null);

   // flatListRef.current.scrollToEnd({ animated: false });

   const keyExtractor = useCallback((message: ChatMessage) => message.chatMessageId, []);

   const renderChatMessage = useCallback<ListRenderItem<ChatMessage>>(
      ({ item: message, index }) => {
         return <Text>{message.messageText}</Text>;
      },
      [messages]
   );

   return (
      <FlatList
         data={messages}
         keyExtractor={keyExtractor}
         renderItem={renderChatMessage}
         ref={flatListRef}
         initialNumToRender={40}
         maxToRenderPerBatch={50}
         inverted
         contentContainerStyle={styles.contentContainerStyle}
      />
   );
};

const styles: Styles = StyleSheet.create({
   contentContainerStyle: {
      flexDirection: "column-reverse"
   }
});

export default Chat;
