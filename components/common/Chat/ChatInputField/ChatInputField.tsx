import React, { FC, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import { ViewTouchable } from "../../ViewTouchable/ViewTouchable";

export interface PropsChatInputField {
   style?: StyleProp<ViewStyle>;
   onSend?: (message: string) => void;
}

const ChatInputField: FC<PropsChatInputField> = props => {
   const { onSend } = props;
   const [text, setText] = useState("");
   const { colors } = useTheme();

   const handleSend = () => {
      onSend?.(text);
      setText("");
   };

   return (
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
         />
         <ViewTouchable onPress={handleSend} style={styles.sendButton}>
            <Icon name={"send"} color={colors.accent2} size={30} />
         </ViewTouchable>
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
