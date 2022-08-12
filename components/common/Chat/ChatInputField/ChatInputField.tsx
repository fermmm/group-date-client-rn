import React, { FC, useEffect, useRef, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, TextInput as RNTextInput } from "react-native";
import { TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { ViewTouchable } from "../../ViewTouchable/ViewTouchable";
import { ChatMessageProps } from "../Chat";
import RespondPreview from "./RespondPreview/RespondPreview";

export interface PropsChatInputField {
   style?: StyleProp<ViewStyle>;
   onSend?: (props: { messageText: string; respondingToChatMessageId?: string }) => void;
   respondingToMessage?: ChatMessageProps;
   onRemoveReply: () => void;
   ownMessageBubbleColor?: string;
   ownMessageNameColor?: string;
   externalMessageBubbleColor?: string;
}

const ChatInputField: FC<PropsChatInputField> = props => {
   const {
      onSend,
      respondingToMessage,
      onRemoveReply,
      ownMessageBubbleColor,
      ownMessageNameColor,
      externalMessageBubbleColor
   } = props;

   const [text, setText] = useState("");
   const [size, setSize] = useState(0);
   const inputRef = useRef<RNTextInput>(null);
   const { colors } = useTheme();

   const handleSend = () => {
      onSend?.({
         ...{ messageText: text },
         ...(respondingToMessage != null
            ? { respondingToChatMessageId: respondingToMessage?.messageId }
            : {})
      });
      onRemoveReply();
      setText("");
      setSize(0);
      inputRef.current.blur();
   };

   // Effect to focus the text input when pressing to respond a message
   useEffect(() => {
      if (respondingToMessage == null) {
         return;
      }

      inputRef.current.focus();
   }, [respondingToMessage]);

   return (
      <View>
         <RespondPreview
            respondingToMessage={respondingToMessage}
            onRemoveReply={onRemoveReply}
            ownMessageBubbleColor={ownMessageBubbleColor}
            ownMessageNameColor={ownMessageNameColor}
            externalMessageBubbleColor={externalMessageBubbleColor}
         />
         <View style={[styles.mainContainer, props.style]}>
            <TextInput
               value={text}
               style={[styles.textInput, { height: Math.min(100, Math.max(45, size)) }]}
               multiline
               onChangeText={t => {
                  setText(t);
               }}
               ref={inputRef}
               onContentSizeChange={e => setSize(e.nativeEvent.contentSize.height)}
            />
            <ViewTouchable onPress={handleSend} style={styles.sendButton}>
               <Icon name={"send"} color={colors.accent2} size={30} />
            </ViewTouchable>
         </View>
      </View>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      flexDirection: "row",
      width: "100%",
      bottom: 0,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 4,
      justifyContent: "center",
      alignItems: "flex-end",
      backgroundColor: currentTheme.colors.background2
   },
   textInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: currentTheme.roundness,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: "center",
      height: 45,
      marginBottom: 10,
      fontSize: 16,
      backgroundColor: "white",
      borderColor: currentTheme.colors.primary
   },
   sendButton: {
      paddingLeft: 10,
      paddingRight: 5,
      paddingBottom: 5,
      paddingTop: 5,
      marginBottom: 10,
      marginLeft: 5
   }
});

export default ChatInputField;
