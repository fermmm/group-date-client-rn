import React, { FC, useEffect, useRef, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, TextInput as RNTextInput } from "react-native";
import { TextInput } from "react-native-paper";
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
}

const ChatInputField: FC<PropsChatInputField> = props => {
   const { onSend, respondingToMessage, onRemoveReply } = props;
   const [text, setText] = useState("");
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
         <RespondPreview respondingToMessage={respondingToMessage} onRemoveReply={onRemoveReply} />
         <View style={[styles.mainContainer, props.style]}>
            <TextInput
               mode={"outlined"}
               value={text}
               dense={false}
               style={styles.textInput}
               multiline
               onChangeText={t => {
                  setText(t);
               }}
               ref={inputRef}
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
      height: 65,
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentTheme.colors.background2
   },
   textInput: {
      flex: 1,
      borderWidth: 0,
      borderRadius: 0,
      justifyContent: "center",
      height: 45,
      marginTop: -10
   },
   sendButton: {
      paddingLeft: 10,
      paddingRight: 5,
      paddingBottom: 5,
      paddingTop: 5,
      marginBottom: 4,
      marginLeft: 5
   }
});

export default ChatInputField;
