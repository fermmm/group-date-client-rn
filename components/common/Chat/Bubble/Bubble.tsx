import moment from "moment";
import React, { FC } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { humanizeUnixTime } from "../../../../common-tools/strings/humanizeUnixTime";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import Avatar from "../../Avatar/Avatar";
import { ViewTouchable } from "../../ViewTouchable/ViewTouchable";
import { ChatMessageProps } from "../Chat";

export interface PropsBubble {
   messageData: ChatMessageProps;
   previousMessageIsSameAuthor?: boolean;
   selected?: boolean;
   onPress?: () => void;
   style?: StyleProp<ViewStyle>;
}

const Bubble: FC<PropsBubble> = props => {
   const { messageData, previousMessageIsSameAuthor, selected, onPress } = props;
   const {
      authorName,
      avatar,
      textContent,
      textColor = "white",
      nameColor = "white",
      bubbleColor,
      isOwnMessage,
      time
   } = messageData;

   const avatarCanBeDisplayed = !previousMessageIsSameAuthor && avatar;

   return (
      <ViewTouchable
         style={[
            styles.messageContainer,
            !avatarCanBeDisplayed && !isOwnMessage && styles.messageContainerWithoutAvatar,
            isOwnMessage && styles.messageContainerOwnMessage,
            isOwnMessage && previousMessageIsSameAuthor && styles.messageContainerOwnMessageAgain,
            selected && styles.messageContainerSelected,
            props.style
         ]}
         onPress={onPress}
      >
         <>
            {avatarCanBeDisplayed && !isOwnMessage && (
               <Avatar size={48} source={messageData.avatar} />
            )}
            <View
               style={[
                  styles.bubble,
                  !isOwnMessage &&
                     (avatarCanBeDisplayed ? styles.bubbleWithAvatar : styles.bubbleWithoutAvatar),
                  { backgroundColor: bubbleColor },
                  isOwnMessage && styles.bubbleOwnMessage
               ]}
            >
               {authorName != null && !previousMessageIsSameAuthor && (
                  <Text style={[styles.nameText, { color: nameColor }]}>{authorName}</Text>
               )}
               {textContent && (
                  <Text style={[styles.textContent, { color: textColor }]}>{textContent}</Text>
               )}
               {time != null && !previousMessageIsSameAuthor && (
                  <Text style={[styles.timeText, { color: nameColor }]}>
                     {humanizeUnixTime(moment().unix() - time)}
                  </Text>
               )}
            </View>
         </>
      </ViewTouchable>
   );
};

const bubblesBorderRadius = 17;
const messagesSeparation = 18;
const messagesSeparationSameAuthor = 2;

const styles: Styles = StyleSheet.create({
   messageContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: messagesSeparation,
      paddingLeft: 10,
      paddingRight: 10
   },
   messageContainerWithoutAvatar: {
      marginTop: messagesSeparationSameAuthor
   },
   messageContainerOwnMessage: {
      justifyContent: "flex-end"
   },
   messageContainerOwnMessageAgain: {
      marginTop: messagesSeparationSameAuthor
   },
   messageContainerSelected: {
      backgroundColor: currentTheme.colors.primary
   },
   bubble: {
      flexDirection: "column",
      flexShrink: 1,
      alignSelf: "flex-start",
      padding: 12,
      borderRadius: bubblesBorderRadius,
      marginLeft: 10
   },
   bubbleWithAvatar: {
      borderBottomLeftRadius: 0
   },
   bubbleWithoutAvatar: {
      marginLeft: 25,
      borderTopLeftRadius: 0
   },
   bubbleOwnMessage: {
      borderTopLeftRadius: bubblesBorderRadius,
      borderBottomRightRadius: 0
   },
   nameText: {
      fontFamily: currentTheme.font.semiBold,
      fontSize: 10,
      alignSelf: "flex-start"
   },
   textContent: {
      fontFamily: currentTheme.font.regular,
      fontSize: 14,
      alignSelf: "flex-start",
      letterSpacing: 0.1,
      lineHeight: 18
   },
   timeText: {
      fontFamily: currentTheme.font.regular,
      fontSize: 9,
      alignSelf: "flex-end",
      marginTop: 2
   }
});

export default Bubble;
